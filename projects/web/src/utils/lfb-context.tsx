import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AthenaDatabase } from "../state/features/database/athena-database";
import { initialDocument } from "../state/features/database/initial-document";
import * as A from "@automerge/automerge";
import { UserDto } from "@ben-ryder/lfb-common";
import {
  EncryptionHelper,
  LFBApplication,
  LFBClient,
  LocalStore,
} from "@ben-ryder/lfb-toolkit";

const SERVER_URL = import.meta.env.VITE_LFB_SERVER_URL;

const localStore = new LocalStore();
const lfbClient = new LFBClient({
  serverUrl: SERVER_URL,
  localStore: localStore,
});
const lfbApplication = new LFBApplication<AthenaDatabase>(initialDocument, {
  localStore: localStore,
  lfbClient: lfbClient,
});

export interface LFBContext {
  loading: boolean;
  document: AthenaDatabase;
  makeChange: (changeFunc: A.ChangeFn<AthenaDatabase>) => void;
  currentUser: UserDto | null;
  online: boolean;
  setOnline: (online: boolean) => void;
  lfbClient: LFBClient;
}

export const LFBContext = createContext<LFBContext>({
  loading: true,
  document: initialDocument,
  makeChange: () => {},
  currentUser: null,
  online: true,
  setOnline: (online: boolean) => {},
  lfbClient: lfbClient,
});

export interface ApplicationProviderProps {
  children: ReactNode;
}

export function LFBProvider(props: ApplicationProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [document, setDocument] =
    useState<A.Doc<AthenaDatabase>>(initialDocument);
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [online, setOnline] = useState<boolean>(true);

  // Hook to do the initial setup and loading
  useEffect(() => {
    async function init() {
      lfbApplication.addUpdateListener((updatedDoc) => {
        // @ts-ignore
        setDocument(updatedDoc);
      });

      let encryptionKey = await localStore.loadEncryptionKey();
      if (!encryptionKey) {
        /**
         * In order to use the application an encryption key must be present.
         * If there is not one present, randomly generate one.
         */
        const randomEncryptionKey = EncryptionHelper.generateEncryptionKey();
        await localStore.saveEncryptionKey(randomEncryptionKey);
      }

      let currentUser = await localStore.loadCurrentUser();
      setCurrentUser(currentUser);

      await lfbApplication.load();
      setLoading(false);
    }
    init();
  }, [lfbApplication]);

  return (
    <LFBContext.Provider
      value={{
        loading,
        document,
        makeChange: lfbApplication.makeChange.bind(lfbApplication),
        currentUser,
        online,
        setOnline,
        lfbClient: lfbClient,
      }}
    >
      {loading ? null : props.children}
    </LFBContext.Provider>
  );
}

export const useLFBApplication = () => useContext(LFBContext);
