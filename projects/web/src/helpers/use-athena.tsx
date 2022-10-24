import { createContext, useContext } from "react";
import { UserDto } from "@ben-ryder/lfb-common";
import { LFBApplication } from "@ben-ryder/lfb-toolkit";
import {Document} from "../state/features/document/document-interface";
import {initialDocument} from "../state/features/document/initial-document";
import {updateDocument} from "../state/features/document/document-reducer";
import {store} from "../state/store";

export type CurrentUserContext = UserDto | null;

export interface IAthenaContext {
  application: LFBApplication<Document>,
  currentUser: CurrentUserContext,
  setCurrentUser: (user: CurrentUserContext) => void
}

export const lfbApplication = new LFBApplication<Document>({
  serverUrl: import.meta.env.VITE_LFB_SERVER_URL,
  initialDocument: initialDocument
});
lfbApplication.addUpdateListener((doc) => {
  store.dispatch(updateDocument(doc));
})


export const AthenaContext = createContext<IAthenaContext>({
  application: lfbApplication,
  currentUser: null,
  setCurrentUser: () => {}
})

export const useAthena = () => useContext(AthenaContext);
