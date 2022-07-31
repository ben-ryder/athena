import axios from 'axios';

import { AthenaEncryption } from './encryption';
import {
    AthenaNoAccessTokenError,
    AthenaNoEncryptionKeyError,
    AthenaNoRefreshTokenError,
    AthenaRequestError,
    AthenaDataDeleteError,
    AthenaDataLoadError,
    AthenaDataSaveError
} from './errors';
import {UserDto} from "./schemas/users/dtos/user.dto";
import {LoginResponse} from "./schemas/auth/response/login.auth.response";
import {RefreshResponse} from "./schemas/auth/response/refresh.auth.response";
import {GetNoteResponse} from "./schemas/notes/response/get.note.response";
import {GetNotesResponse} from "./schemas/notes/response/get.notes.response";
import {NoteDto} from "./schemas/notes/dtos/note.dto";
import {CreateNoteResponse} from "./schemas/notes/response/create.notes.response";
import {UpdateNoteResponse} from "./schemas/notes/response/update.notes.response";
import {CreateNoteRequest} from "./schemas/notes/request/create.notes.request";
import {CreateUserRequest} from "./schemas/users/request/create.users.request";
import {InfoDto} from "./schemas/info/dtos/info.dto";
import {CreateUserResponse} from "./schemas/users/response/create.users.response";
import {NoKeysUserDto} from "./schemas/users/dtos/no-keys-user.dto";
import {CreateVaultRequest} from "./schemas/vaults/request/create.vaults.request";
import {VaultsQueryParams} from "./schemas/vaults/request/query-params.vaults.request";
import {UpdateVaultRequest} from "./schemas/vaults/request/update.vaults.request";
import {GetVaultsResponse} from "./schemas/vaults/response/get.vaults.response";
import {GetVaultResponse} from "./schemas/vaults/response/get.vault.response";


export interface QueryOptions {
    url: string,
    method: 'GET'|'POST'|'PATCH'|'DELETE',
    data?: object,
    params?: object,
    noAuthRequired?: boolean,
    requiresEncryptionKey?: boolean
}

export type DataLoader<T> = () => Promise<T|null>;
export type DataSaver<T> = (data: T) => Promise<void>;
export type DataDeleter<T> = () => Promise<void>;

export interface AthenaAPIClientOptions {
    apiEndpoint: string;

    saveEncryptionKey: DataSaver<string>;
    loadEncryptionKey: DataLoader<string>;
    deleteEncryptionKey: DataDeleter<string>;

    loadAccessToken: DataLoader<string>;
    saveAccessToken: DataSaver<string>;
    deleteAccessToken: DataDeleter<string>;

    loadRefreshToken: DataLoader<string>;
    saveRefreshToken: DataSaver<string>;
    deleteRefreshToken: DataDeleter<string>;

    loadCurrentUser: DataLoader<UserDto>;
    saveCurrentUser: DataSaver<UserDto>;
    deleteCurrentUser: DataDeleter<UserDto>;
}

export class AthenaAPIClient {
    private readonly options: AthenaAPIClientOptions;
    private encryptionKey?: string;
    private accessToken?: string;
    private refreshToken?: string;

    constructor(options: AthenaAPIClientOptions) {
        this.options = options;
    }

    private async query<ResponseType>(options: QueryOptions, repeat = false): Promise<ResponseType> {
        if (!options.noAuthRequired && !this.accessToken) {
            const accessToken = await AthenaAPIClient.loadData(this.options.loadAccessToken);
            const refreshToken = await AthenaAPIClient.loadData(this.options.loadRefreshToken);
            if (refreshToken) {
                this.refreshToken = refreshToken;
            }
            else {
                throw new AthenaNoRefreshTokenError();
            }

            if (accessToken) {
                this.accessToken = accessToken;
            }
            else if (!repeat) {
                return this.refreshAuthAndRetry(options);
            }
            else {
                throw new AthenaNoAccessTokenError();
            }
        }


        let response: any = null;
        try {
            response = await axios({
                ...options,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
        }
        catch (e: any) {
            if (e.response?.status === 401 && !repeat) {
                return this.refreshAuthAndRetry<ResponseType>(options);
            }

            throw new AthenaRequestError(
                {
                    message: `There was an error with the request '${options.url} [${options.method}]'`,
                    originalError: e,
                    response: e.response?.data
                }
            );
        }

        return response.data;
    }

    private async refreshAuthAndRetry<ResponseType>(options: QueryOptions): Promise<ResponseType> {
        await this.refresh();
        return this.query(options, true);
    }

    private async checkEncryptionKey() {
        if (!this.encryptionKey) {
            const encryptionKey = await AthenaAPIClient.loadData(this.options.loadEncryptionKey);

            if (encryptionKey) {
                this.encryptionKey = encryptionKey;
                return;
            }

            throw new AthenaNoEncryptionKeyError();
        }
    }

    // Data Loading
    private static async loadData(loader: DataLoader<any>) {
        try {
            return await loader();
        }
        catch (e) {
            throw new AthenaDataLoadError({originalError: e});
        }
    }

    private static async saveData(saver: DataSaver<any>, data: any) {
        try {
            return await saver(data);
        }
        catch (e) {
            throw new AthenaDataSaveError({originalError: e});
        }
    }

    private static async deleteData(deleter: DataDeleter<any>) {
        try {
            return await deleter();
        }
        catch (e) {
            throw new AthenaDataDeleteError({originalError: e});
        }
    }

    // Info
    async getInfo() {
        return this.query<InfoDto>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/info`,
            noAuthRequired: true
        });
    }

    // User
    public async login(username: string, password: string) {
        // Convert plain text password into serverPassword and masterKey
        const accountKeys = AthenaEncryption.getAccountKeys(username, password);
        
        const data = await this.query<LoginResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/auth/login`,
            data: {
                username,
                password: accountKeys.serverPassword
            },
            noAuthRequired: true
        });
        
        // Decrypt users encryptionKey with their masterKey
        // todo: don't trust data is encrypted correctly
        const encryptionKey = AthenaEncryption.decryptText(accountKeys.masterKey, data.user.encryptionSecret);
        await AthenaAPIClient.saveData(this.options.saveEncryptionKey, encryptionKey);

        // Save user details and tokens
        await AthenaAPIClient.saveData(this.options.saveCurrentUser, data.user);

        await AthenaAPIClient.saveData(this.options.saveRefreshToken, data.refreshToken);
        this.refreshToken = data.refreshToken;
        
        await AthenaAPIClient.saveData(this.options.saveAccessToken, data.accessToken);
        this.accessToken = data.accessToken;

        return data;
    }

    public async register(noKeysUser: NoKeysUserDto) {
        // Get user account keys from plain text password and overwrite the user password.
        const accountKeys = AthenaEncryption.getAccountKeys(noKeysUser.username, noKeysUser.password);

        // Generate the user's encryptionSecret
        const encryptionKey = AthenaEncryption.generateEncryptionKey();
        const encryptionSecret = AthenaEncryption.encryptText(accountKeys.masterKey, encryptionKey);

        const user: CreateUserRequest = {
            username: noKeysUser.username,
            email: noKeysUser.email,
            password: accountKeys.serverPassword,
            encryptionSecret
        }

        const data = await this.query<CreateUserResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/users`,
            data: user,
            noAuthRequired: true
        });

        await AthenaAPIClient.saveData(this.options.saveEncryptionKey, encryptionKey);
        await AthenaAPIClient.saveData(this.options.saveCurrentUser, data.user);

        await AthenaAPIClient.saveData(this.options.saveRefreshToken, data.refreshToken);
        this.refreshToken = data.refreshToken;
        await AthenaAPIClient.saveData(this.options.saveAccessToken, data.accessToken);
        this.accessToken = data.accessToken;

        return data;
    }

    public async logout() {
        // todo: loading from external if not found?
        let tokens: any = {};
        if (this.accessToken) {
            tokens.accessToken = this.accessToken;
        }
        if (this.refreshToken) {
            tokens.refreshToken = this.refreshToken;
        }

        await this.query({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/auth/revoke`,
            noAuthRequired: true,
            data: tokens
        });

        await AthenaAPIClient.deleteData(this.options.deleteCurrentUser);
        await AthenaAPIClient.deleteData(this.options.deleteEncryptionKey);

        await AthenaAPIClient.deleteData(this.options.deleteRefreshToken);
        delete this.refreshToken;
        await AthenaAPIClient.deleteData(this.options.deleteAccessToken);
        delete this.accessToken;
    }

    private async refresh() {
        if (!this.refreshToken) {
            throw new AthenaNoRefreshTokenError();
        }

        const data = await this.query<RefreshResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/auth/refresh`,
            noAuthRequired: true,
            data: {
                refreshToken: this.refreshToken
            }
        });

        await AthenaAPIClient.saveData(this.options.saveRefreshToken, data.refreshToken);
        this.refreshToken = data.refreshToken;
        await AthenaAPIClient.saveData(this.options.saveAccessToken, data.accessToken);
        this.accessToken = data.accessToken;

        return data;
    }

    // Vaults
    async createVault(vault: CreateVaultRequest) {
        return this.query<CreateNoteResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/vaults`,
            data: vault
        })
    }

    async getVaults(options?: VaultsQueryParams) {
        return this.query<GetVaultsResponse>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/vaults`,
            params: options || {}
        })
    }

    async getVault(vaultId: string) {
        return this.query<GetVaultResponse>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/vaults/${vaultId}`
        })
    }

    async updateVault(vaultId: string, vaultUpdate: UpdateVaultRequest) {
        return this.query<UpdateNoteResponse>({
            method: 'PATCH',
            url: `${this.options.apiEndpoint}/v1/vaults/${vaultId}`,
            data: vaultUpdate
        })
    }

    async deleteVault(vaultId: string) {
        return this.query({
            method: 'DELETE',
            url: `${this.options.apiEndpoint}/v1/vaults/${vaultId}`
        })
    }

    // Note Listing Endpoints
    private async getEncryptedNotes(): Promise<GetNotesResponse> {
        return this.query<GetNotesResponse>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/notes`
        });
    }

    async getNotes(): Promise<GetNotesResponse> {
        await this.checkEncryptionKey();

        const encryptedNotesResponse = await this.getEncryptedNotes();
        let notes: NoteDto[] = [];
        for (let note of encryptedNotesResponse.notes) {
            notes.push(
              AthenaEncryption.decryptNote(<string> this.encryptionKey, note)
            )
        }

        return {
            notes,
            meta: encryptedNotesResponse.meta
        };
    }

    // Note Endpoints
    async createNote(newNote: CreateNoteRequest) {
        await this.checkEncryptionKey();

        const encryptedNote = AthenaEncryption.encryptNoteContent(<string> this.encryptionKey, newNote);

        return this.query<CreateNoteResponse>({
            method: 'POST',
            url: `${this.options.apiEndpoint}/v1/notes`,
            data: encryptedNote
        })
    }

    private async getEncryptedNote(noteId: string): Promise<GetNoteResponse> {
        return this.query<GetNoteResponse>({
            method: 'GET',
            url: `${this.options.apiEndpoint}/v1/notes/${noteId}`
        })
    }

    async getNote(noteId: string): Promise<GetNoteResponse> {
        await this.checkEncryptionKey();

        const encryptedNote = await this.getEncryptedNote(noteId);
        return AthenaEncryption.decryptNote(<string> this.encryptionKey, encryptedNote);
    }

    async updateNote(noteId: string, note: NoteDto) {
        await this.checkEncryptionKey();

        const encryptedNoteUpdate = await AthenaEncryption.encryptNote(<string> this.encryptionKey, note);
        return this.query<UpdateNoteResponse>({
            method: 'PATCH',
            url: `${this.options.apiEndpoint}/v1/notes/${noteId}`,
            data: encryptedNoteUpdate
        })
    }

    async deleteNote(noteId: string) {
        return this.query({
            method: 'DELETE',
            url: `${this.options.apiEndpoint}/v1/notes/${noteId}`
        })
    }
}
