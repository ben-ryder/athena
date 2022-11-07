import { createContext, useContext } from "react";
import { UserDto } from "@ben-ryder/lfb-common";
import { LFBApplication } from "@ben-ryder/lfb-toolkit";
import {AthenaDatabase} from "../state/features/database/athena-database";
import {initialDocument} from "../state/features/database/initial-document";

export type CurrentUserContext = UserDto | null;

export interface ApplicationContext {
  application: LFBApplication<AthenaDatabase>,
}

export interface DocumentContext {
  document: AthenaDatabase,
  setDocument: (doc: AthenaDatabase) => void
}


export const lfbApplication = new LFBApplication<AthenaDatabase>(initialDocument);

export const AthenaApplicationContext = createContext<ApplicationContext>({
  application: lfbApplication
});

export const DocumentContext = createContext<DocumentContext>({
  document: initialDocument,
  setDocument: (doc: AthenaDatabase) => {}
})

export const useApplication = () => useContext(AthenaApplicationContext);
export const useDocument = () => useContext(DocumentContext);
