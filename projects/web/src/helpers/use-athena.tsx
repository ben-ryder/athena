import { createContext, useContext } from "react";
import { UserDto } from "@ben-ryder/lfb-common";
import { APIClient } from "@ben-ryder/lfb-toolkit";
import { AthenaStorage } from "./athena-storage";

export type CurrentUserContext = UserDto | null;

export interface IAthenaContext {
  apiClient: APIClient,
  storage: AthenaStorage,
  currentUser: CurrentUserContext,
  setCurrentUser: (user: CurrentUserContext) => void
}

export const athenaStorageInstance = new AthenaStorage();

export const athenaAPIClientInstance = new APIClient({
  apiEndpoint: import.meta.env.VITE_LFB_API_ENDPOINT,
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
