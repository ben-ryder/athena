import z from "zod";
import {GeneralStorage} from "./general-storage";


export class SecretsStorage {
    private REFRESH_TOKEN_KEY = 'lf_account_authRefreshToken';

    // todo: is there a better way to store this data?
    private accessToken: string|null = null;
    private vaultEncryptionKeys: {[key: string]: CryptoKey} = {}

    async loadAccessToken(): Promise<string|null> {
        return this.accessToken
    }
    async saveAccessToken(accessToken: string): Promise<void> {
        this.accessToken = accessToken
    }
    async deleteAccessToken() {
        this.accessToken = null;
    }

    async loadRefreshToken(): Promise<string|null> {
        return GeneralStorage._loadLocalStorageData(this.REFRESH_TOKEN_KEY, z.string())
    }
    async saveRefreshToken(token: string): Promise<void> {
        return GeneralStorage._saveLocalStorageData(this.REFRESH_TOKEN_KEY, token)
    }
    async deleteRefreshToken(): Promise<void> {
        return GeneralStorage._deleteLocalStorageData(this.REFRESH_TOKEN_KEY)
    }

    async loadVaultEncryptionKey(vaultId: string): Promise<CryptoKey|null> {
        return this.vaultEncryptionKeys[vaultId] || null
    }
    async saveVaultEncryptionKey(vaultId: string, key: CryptoKey): Promise<void> {
        this.vaultEncryptionKeys[vaultId] = key
    }
    async deleteVaultEncryptionKey(vaultId: string) {
        if (this.vaultEncryptionKeys[vaultId]) {
            delete this.vaultEncryptionKeys[vaultId]
        }
    }
}
