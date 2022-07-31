import { createContext, useContext } from "react";
import { AthenaAPIClient, UserDto } from "@ben-ryder/athena-js-lib";
import {AthenaStorage} from "./athena-storage";

export type CurrentUserContext = UserDto | null;

export interface IAthenaContext {
    apiClient: AthenaAPIClient,
    storage: AthenaStorage,
    currentUser: CurrentUserContext,
    setCurrentUser: (user: CurrentUserContext) => void
}

export const athenaStorageInstance = new AthenaStorage();

export const athenaAPIClientInstance = new AthenaAPIClient({
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
    saveEncryptionKey: athenaStorageInstance.saveEncryptionKey,
    loadEncryptionKey: athenaStorageInstance.loadEncryptionKey,
    deleteEncryptionKey: athenaStorageInstance.deleteEncryptionKey,
    saveAccessToken: athenaStorageInstance.saveAccessToken,
    loadAccessToken: athenaStorageInstance.loadAccessToken,
    deleteAccessToken: athenaStorageInstance.deleteAccessToken,
    saveRefreshToken: athenaStorageInstance.saveRefreshToken,
    loadRefreshToken: athenaStorageInstance.loadRefreshToken,
    deleteRefreshToken: athenaStorageInstance.deleteRefreshToken,
    saveCurrentUser: athenaStorageInstance.saveCurrentUser,
    loadCurrentUser: athenaStorageInstance.loadCurrentUser,
    deleteCurrentUser: athenaStorageInstance.deleteCurrentUser
});


export const AthenaContext = createContext<IAthenaContext>({
    apiClient: athenaAPIClientInstance,
    storage: athenaStorageInstance,
    currentUser: null,
    setCurrentUser: () => {}
})

export const useAthena = () => useContext(AthenaContext);
