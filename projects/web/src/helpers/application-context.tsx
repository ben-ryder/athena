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


export const application = new LFBApplication<AthenaDatabase>(
  import.meta.env.VITE_LFB_SERVER_URL,
  initialDocument
);

export const DocumentContext = createContext<DocumentContext>({
  document: initialDocument,
  setDocument: (doc: AthenaDatabase) => {}
})

export const useDocument = () => useContext(DocumentContext);
