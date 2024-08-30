import {
	RequestError,
	LocalfulError
} from '../common/errors';
import {
	ErrorIdentifiers,
	UpdateUserDto,
	UserDto,
	LoginResponse,
	CreateUserDto,
	LoginRequest, ServerInfoDto, TokenPair,
} from "@localful/common";
import {io, Socket} from "socket.io-client";
import {DeviceStorage} from "../storage/storage";

export interface QueryOptions {
	url: string,
	method: 'GET'|'POST'|'PATCH'|'DELETE',
	data?: object,
	params?: URLSearchParams,
	noAuthRequired?: boolean,
	disableAuthRetry?: boolean
}

export interface ServerClientConfig {
	serverUrl: string;
	deviceStorage: DeviceStorage,
}

export class ServerClient {
	private readonly socket: Socket
	private readonly config: ServerClientConfig;
	private readonly deviceStorage: DeviceStorage;

	constructor(config: ServerClientConfig) {
		this.config = config;
		this.deviceStorage = config.deviceStorage;
		this.socket = io(this.config.serverUrl);
	}

	// Basic Query
	private async query<ResponseType>(options: QueryOptions): Promise<ResponseType> {
		const headers: Headers = new Headers({"Content-Type": "application/json"})

		if (!options.noAuthRequired) {
			const accessToken = await this.deviceStorage.secrets.loadAccessToken();

			// This might be the first request of this session, so refresh auth to fetch a new access token and retry the request.
			if (!accessToken && !options.disableAuthRetry) {
				return this.refreshAuthAndRetry<ResponseType>(options)
			}

			headers.set("Authorization", `Bearer ${accessToken}`)
		}

		const url =
            options.params && Array.from(options.params.keys()).length > 0
            	? `${this.config.serverUrl}${options.url}?${options.params.toString()}`: `${this.config.serverUrl}${options.url}`

		try {
			const response = await fetch(
				url,
				{
					method: options.method,
					body: JSON.stringify(options.data),
					headers
				});
			return await response.json()
		}
		catch (e: any) {
			// If the request failed due to ACCESS_UNAUTHORIZED, the access token may just have expired so refresh auth
			// and retry the request.
			if (e.response?.data?.identifier === ErrorIdentifiers.ACCESS_UNAUTHORIZED && !options.disableAuthRetry) {
				return this.refreshAuthAndRetry<ResponseType>(options)
			}

			throw new RequestError(
				{
					message: `There was an error with the request '${options.url} [${options.method}]'`,
					originalError: e,
					response: e.response?.data
				}
			);
		}
	}

	private async refreshAuthAndRetry<ResponseType>(options: QueryOptions): Promise<ResponseType> {
		await this.refresh();

		return this.query({
			...options,
			// Disable auth retry as we've already done that now.
			disableAuthRetry: true
		});
	}

	public async login(data: LoginRequest) {
		return this.query<LoginResponse>({
			method: 'POST',
			url: `/v1/auth/login`,
			data,
			noAuthRequired: true
		});
	}

	public async register(createUserDto: CreateUserDto) {
		return await this.query<UserDto>({
			method: 'POST',
			url: `/v1/users`,
			data: createUserDto,
			noAuthRequired: true
		});
	}

	public async logout() {
		const refreshToken = await this.deviceStorage.secrets.loadRefreshToken()
		if (!refreshToken) {
			await this.deviceStorage.secrets.deleteAccessToken()
			throw new LocalfulError({message: "No refreshToken found while attempting to logout"})
		}

		await this.query({
			method: 'POST',
			url: `/v1/auth/revoke`,
			noAuthRequired: true,
			data: {
				refreshToken,
			}
		});

		await this.deviceStorage.general.deleteCurrentUser()
		await this.deviceStorage.secrets.deleteAccessToken()
		await this.deviceStorage.secrets.deleteRefreshToken()
	}

	public async refresh() {
		const refreshToken = this.deviceStorage.secrets.loadRefreshToken()
		if (!refreshToken) {
			await this.deviceStorage.secrets.deleteAccessToken()
			throw new LocalfulError({message: "No refreshToken found during auth refresh"})
		}

		let tokens: TokenPair;
		try {
			tokens = await this.query({
				method: 'POST',
				url: `/v1/auth/refresh`,
				noAuthRequired: true,
				data: {
					refreshToken,
				}
			});

			await this.deviceStorage.secrets.saveAccessToken(tokens.accessToken)
			await this.deviceStorage.secrets.saveRefreshToken(tokens.refreshToken)
		}
		catch(e: any) {
			// Delete all user data if the session is no longer valid
			if (e.response?.data?.identifier === ErrorIdentifiers.ACCESS_UNAUTHORIZED) {
				await this.deviceStorage.general.deleteCurrentUser()
				await this.deviceStorage.secrets.deleteAccessToken()
				await this.deviceStorage.secrets.deleteRefreshToken()
			}

			throw e;
		}
	}

	// Info
	async getInfo() {
		return this.query<ServerInfoDto>({
			method: 'GET',
			url: `/v1/info`,
			noAuthRequired: true
		});
	}

	// Users
	async getUser(userId: string) {
		return this.query<UserDto>({
			method: 'GET',
			url: `/v1/users/${userId}`,
		});
	}

	async deleteUser(userId: string) {
		return this.query<void>({
			method: 'DELETE',
			url: `/v1/users/${userId}`,
		});
	}

	async updateUser(userId: string, update: UpdateUserDto) {
		return this.query<UserDto>({
			method: 'PATCH',
			url: `/v1/users/${userId}`,
			data: update
		});
	}
}
