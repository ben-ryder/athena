import {createContext, useContext, useEffect, useState} from "react";
import {AthenaDatabase} from "../state/features/database/athena-database";
import {initialDocument} from "../state/features/database/initial-document";
import * as A from "@automerge/automerge";
import {StrictReactNode} from "@ben-ryder/jigsaw";
import {UserDto} from "@ben-ryder/lfb-common";
import {EncryptionHelper, LFBApplication, LFBClient, LocalStore} from "@ben-ryder/lfb-toolkit";

const SERVER_URL = import.meta.env.VITE_LFB_SERVER_URL;

const localStore = new LocalStore();
const lfbClient = new LFBClient({
  serverUrl: SERVER_URL,
  localStore: localStore
});
const lfbApplication = new LFBApplication<AthenaDatabase>(initialDocument, {
  localStore: localStore,
  lfbClient: lfbClient
});


export interface LFBContext {
  loading: boolean,
  document: AthenaDatabase,
  makeChange: (changeFunc: A.ChangeFn<AthenaDatabase>) => void,
  currentUser: UserDto | null,
  online: boolean,
  lfbClient: LFBClient
}

export const LFBContext = createContext<LFBContext>({
  loading: true,
  document: initialDocument,
  makeChange: () => {},
  currentUser: null,
  online: true,
  lfbClient: lfbClient
});

export interface ApplicationProviderProps {
  children: StrictReactNode
}


export function LFBProvider(props: ApplicationProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [document, setDocument] = useState<A.Doc<AthenaDatabase>>(initialDocument);
  const [currentUser, setCurrentUser] = useState<UserDto|null>(null);
  const [online, setOnline] = useState<boolean>(true);

  // Hook to do the initial setup and loading
  useEffect(() => {
    async function init() {
      lfbApplication.addUpdateListener((updatedDoc) => {
        // @ts-ignore
        setDocument(updatedDoc);
      })

      const currentUser = await localStore.loadCurrentUser();
      setCurrentUser(currentUser);

      if (currentUser) {
        await lfbApplication.load();
      }
      else {
        /**
         * In order to use the application an encryption key must be present.
         * If there is no logged-in user then randomly generate one.
         */
        const randomEncryptionKey = EncryptionHelper.generateEncryptionKey();
        await localStore.saveEncryptionKey(randomEncryptionKey);
      }

      setLoading(false);
    }
    init()
  }, [lfbApplication]);

  return (
    <LFBContext.Provider
      value={{
        loading,
        document,
        makeChange: lfbApplication.makeChange.bind(lfbApplication),
        currentUser,
        online,
        lfbClient: lfbClient
      }}
    >
      {loading ? null : props.children}
    </LFBContext.Provider>
  )
}

export const useLFBApplication = () => useContext(LFBContext);
