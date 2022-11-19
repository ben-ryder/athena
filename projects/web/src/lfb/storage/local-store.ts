import {db} from "./db";
import {ChangeDto} from "@ben-ryder/lfb-common";
import {UserProfile} from "../common/user-profile";

export class LocalStore {
    USER_PROFILE_STORAGE_KEY = 'userProfile';
    USER_ID_STORAGE_KEY = 'userId';
    USER_ENCRYPTION_KEY_STORAGE_KEY = 'userEncryptionKey';

    async loadAllChanges(): Promise<ChangeDto[]> {
        return db.changes.toArray();
    }

    async loadChanges(ids: string[]): Promise<ChangeDto[]> {
        return db.changes
          .where("id").anyOf(ids)
          .toArray();
    }

    async loadAllChangeIds(): Promise<string[]> {
        const changes = await db.changes.toArray();
        return changes.map(change => change.id);
    }

    async saveChange(change: ChangeDto): Promise<void> {
        await db.changes.add(change);
    }

    async deleteAllChanges() {
        await db.changes.clear()
    }

    async loadUserEncryptionKey(): Promise<string|null> {
        return localStorage.getItem(this.USER_ENCRYPTION_KEY_STORAGE_KEY);
    }
    async saveUserEncryptionKey(encryptionKey: string) {
        localStorage.setItem(this.USER_ENCRYPTION_KEY_STORAGE_KEY, encryptionKey);
    }
    async deleteUserEncryptionKey() {
        return localStorage.removeItem(this.USER_ENCRYPTION_KEY_STORAGE_KEY);
    }

    async loadUserId(): Promise<string|null> {
        return localStorage.getItem(this.USER_ID_STORAGE_KEY);
    }
    async saveUserId(userId: string) {
        localStorage.setItem(this.USER_ID_STORAGE_KEY, userId);
    }
    async deleteUserId() {
        return localStorage.removeItem(this.USER_ID_STORAGE_KEY);
    }

    async loadUserProfile(): Promise<UserProfile|null> {
        const raw = localStorage.getItem(this.USER_PROFILE_STORAGE_KEY);
        if (raw) {
            try {
                const loaded = JSON.parse(raw);

                if (loaded.encryptionSecret !== null) {
                    return loaded as UserProfile;
                }
            }
            catch (e) {}
        }

        // The profile may not be valid, so remove it just to be safe.
        await this.deleteUserProfile();
        return null;
    }
    async saveUserProfile(userProfile: UserProfile) {
        localStorage.setItem(this.USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    }
    async deleteUserProfile() {
        return localStorage.removeItem(this.USER_PROFILE_STORAGE_KEY);
    }

    async deleteAll() {
        await this.deleteUserId();
        await this.deleteUserProfile();
        await this.deleteUserEncryptionKey();
        await this.deleteAllChanges();
    }
}

export const localStore = new LocalStore();
