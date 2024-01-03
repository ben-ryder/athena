import {LocalfulError, LocalfulErrorIdentifiers, RequestError} from "../common/errors";
import {
  CreateUserDto,
  ErrorIdentifiers,
  LoginRequest,
  LoginResponse,
  ServerInfoDto, TokenPair,
  UpdateUserDto,
  UserDto
} from "@localful/common";
import {io, Socket} from "socket.io-client";

export interface QueryOptions {
  url: string,
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  data?: object,
  params?: URLSearchParams,
  noAuthRequired?: boolean,
  disableAuthRetry?: boolean
}

export interface ServerClientConfig {
  getAccessToken: () => Promise<string|null>,
  getRefreshToken: () => Promise<string|null>,
  onEvent: (event: LocalfulEvent<any>) => Promise<void>
}

export interface LocalfulEvent<Data> {
  identifier: string,
  data: Data
}


export class ServerClient {
  private serverBaseUrl!: string|null
  private socket!: Socket|null
  private readonly config: ServerClientConfig;

  constructor(config: ServerClientConfig) {
    this.config = config;
  }

  async init(serverBaseUrl: string) {
    this.serverBaseUrl = serverBaseUrl

    // todo: add service worker for websocket communications etc?
    this.socket = io(this.serverBaseUrl);
  }

  async teardown() {
    if (this.socket) {
      this.socket.disconnect()
    }

    this.serverBaseUrl = null;
  }

  async emitEvent(event: LocalfulEvent<any>) {
    this.config.onEvent(event)
  }

  // Basic Query
  private async query<ResponseType>(options: QueryOptions): Promise<ResponseType> {
    if (!this.serverBaseUrl) {
      throw new LocalfulError({
        identifier: LocalfulErrorIdentifiers.SERVER_NOT_INITIALISED,
        message: "The server has not yet been initialised"
      })
    }

    const headers: Headers = new Headers({"Content-Type": "application/json"})

    if (!options.noAuthRequired) {
      const accessToken = await this.config.getAccessToken();

      // This might be the first request of this session, so refresh auth to fetch a new access token and retry the request.
      if (!accessToken && !options.disableAuthRetry) {
        return this.refreshAuthAndRetry<ResponseType>(options)
      }

      headers.set("Authorization", `Bearer ${accessToken}`)
    }

    const url =
      options.params && Array.from(options.params.keys()).length > 0
        ? `${this.serverBaseUrl}${options.url}?${options.params.toString()}`: `${this.serverBaseUrl}${options.url}`

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
          identifier: LocalfulErrorIdentifiers.REQUEST_ERROR,
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

  public async login(login: LoginRequest) {
    return this.query<LoginResponse>({
      method: 'POST',
      url: `/v1/auth/login`,
      data: login,
      noAuthRequired: true
    });
  }

  public async register(createUserDto: CreateUserDto) {
    return this.query<LoginResponse>({
      method: 'POST',
      url: `/v1/users`,
      data: createUserDto,
      noAuthRequired: true
    });
  }

  public async logout() {
    const refreshToken = await this.config.getRefreshToken()
    if (!refreshToken) {
      throw new LocalfulError({
        identifier: LocalfulErrorIdentifiers.MISSING_REFRESH_TOKEN,
        message: "No refreshToken found during auth refresh"
      })
    }

    await this.query({
      method: 'POST',
      url: `/v1/auth/revoke`,
      noAuthRequired: true,
      data: {
        refreshToken,
      }
    });
  }

  public async refresh() {
    const refreshToken = await this.config.getRefreshToken()
    if (!refreshToken) {
      throw new LocalfulError({
        identifier: LocalfulErrorIdentifiers.MISSING_REFRESH_TOKEN,
        message: "No refreshToken found during auth refresh"
      })
    }

    const data = await this.query<TokenPair>({
      method: 'POST',
      url: `/v1/auth/refresh`,
      noAuthRequired: true,
      data: {
        refreshToken,
      }
    });

    // This refresh may be called automatically during other API calls,
    // and every API call shouldn't have to handle refresh logic.
    // For that reason, a refresh will also emit an event that
    // consumers can listen for independent of any other API calls.
    await this.emitEvent({
      identifier: "TOKEN_UPDATE",
      data: data
    })

    return data
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
