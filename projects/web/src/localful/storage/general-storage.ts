import {ServerInfoDto, UserDto} from "@localful/common";
import z from "zod"

export class GeneralStorage {
    private SERVER_URL_KEY = 'lf_server_url';
    private SERVER_INFO_KEY = 'lf_server_info';

    private CURRENT_USER_KEY = 'lf_account_currentUser';

    private HAS_ONBOARDED_KEY = 'lf_app_hasOnboarded';
    private HAS_STORAGE_PERMISSIONS_KEY = 'lf_app_hasStoragePermissions';

    private CURRENT_CLOUD_VAULTS = 'lf_app_currentCloudVaults';

    static async _loadLocalStorageData<Schema>(key: string, schema: z.ZodType<Schema>): Promise<Schema|null> {
        const rawString = localStorage.getItem(key);
        if (rawString) {
            try {
                const rawObject = JSON.parse(rawString);
                return schema.parse(rawObject)
            }
            catch (e) {
                // If the storage value is invalid, automatically clear it up.
                localStorage.removeItem(key)
                return null;
            }
        }
        return null;
    }
    static async _loadLocalStorageFlag(key: string): Promise<boolean> {
        const value = await GeneralStorage._loadLocalStorageData(key, z.boolean())
        if (typeof value !== 'boolean') {
            await GeneralStorage._saveLocalStorageData(key, false)
            return false
        }

        return value
    }
    static async _saveLocalStorageData(key: string, data: any): Promise<void> {
        localStorage.setItem(key, data);
    }
    static async _deleteLocalStorageData(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    async purgeAll() {
        await this.deleteCurrentUser();
    }

    async loadServerUrl(): Promise<string|null> {
        return GeneralStorage._loadLocalStorageData(this.SERVER_URL_KEY, z.string().url())
    }
    async saveServerUrl(serverUrl: string): Promise<void> {
        return GeneralStorage._saveLocalStorageData(this.SERVER_URL_KEY, serverUrl)
    }
    async deleteServerUrl(): Promise<void> {
        return GeneralStorage._deleteLocalStorageData(this.SERVER_URL_KEY)
    }

    async loadServerInfo(): Promise<ServerInfoDto|null> {
        return GeneralStorage._loadLocalStorageData(this.SERVER_INFO_KEY, ServerInfoDto)
    }
    async saveServerInfo(serverInfo: ServerInfoDto): Promise<void> {
        return GeneralStorage._saveLocalStorageData(this.SERVER_INFO_KEY, serverInfo)
    }
    async deleteServerInfo(): Promise<void> {
        return GeneralStorage._deleteLocalStorageData(this.SERVER_INFO_KEY)
    }

    async loadCurrentUser(): Promise<UserDto|null> {
        return GeneralStorage._loadLocalStorageData<UserDto>(this.CURRENT_USER_KEY, UserDto)
    }
    async saveCurrentUser(user: UserDto) {
        return GeneralStorage._saveLocalStorageData(this.CURRENT_USER_KEY, user)
    }
    async deleteCurrentUser() {
        return GeneralStorage._deleteLocalStorageData(this.CURRENT_USER_KEY)
    }

    async loadHasOnboarded(): Promise<boolean> {
        return GeneralStorage._loadLocalStorageFlag(this.HAS_ONBOARDED_KEY)
    }
    async setHasOnboarded(value: boolean): Promise<void> {
        return GeneralStorage._saveLocalStorageData(this.HAS_ONBOARDED_KEY, value)
    }

    async loadHasStoragePermissions(): Promise<boolean> {
        return GeneralStorage._loadLocalStorageFlag(this.HAS_STORAGE_PERMISSIONS_KEY)
    }
    async setHasStoragePermissions(value: boolean): Promise<void> {
        return GeneralStorage._saveLocalStorageData(this.HAS_STORAGE_PERMISSIONS_KEY, value)
    }

    async loadCurrentCloudVaults(): Promise<string[]> {
        const vaults = await GeneralStorage._loadLocalStorageData(this.CURRENT_CLOUD_VAULTS, z.array(z.string().uuid()))
        return vaults ? vaults : []
    }
    async addCurrentCloudVault(vaultId: string): Promise<void> {
        const vaults = await this.loadCurrentCloudVaults()
        if (!vaults.includes(vaultId)) {
            vaults.push(vaultId)
        }
        return GeneralStorage._saveLocalStorageData(this.CURRENT_CLOUD_VAULTS, vaults)
    }
    async removeCurrentCloudVault(vaultId: string): Promise<void> {
        let vaults = await this.loadCurrentCloudVaults()
        vaults = vaults.filter(id => id !== vaultId)
        return GeneralStorage._saveLocalStorageData(this.CURRENT_CLOUD_VAULTS, vaults)
    }
    async deleteAllCurrentCloudVaults(): Promise<void> {
        return GeneralStorage._saveLocalStorageData(this.CURRENT_CLOUD_VAULTS, [])
    }
}
