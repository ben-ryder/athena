import { createContext, useContext } from "react";
import { UserDto } from "@ben-ryder/lfb-common";
import { LFBApplication } from "@ben-ryder/lfb-toolkit";
import {Document} from "../state/features/database/athena-database";
import {initialDocument} from "../state/features/database/initial-document";

export type CurrentUserContext = UserDto | null;

export interface ApplicationContext {
  application: LFBApplication<Document>,
}

export interface DocumentContext {
  document: Document,
  setDocument: (doc: Document) => void
}


export const lfbApplication = new LFBApplication<Document>(initialDocument);
export const AthenaApplicationContext = createContext<ApplicationContext>({
  application: lfbApplication
});

export const DocumentContext = createContext<DocumentContext>({
  document: initialDocument,
  setDocument: (doc: Document) => {}
})

export const useApplication = () => useContext(AthenaApplicationContext);
export const useDocument = () => useContext(DocumentContext);
