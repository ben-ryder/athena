import {createContext, useContext, useEffect, useState} from "react";
import {AthenaDatabase} from "../state/features/database/athena-database";
import {initialDocument} from "../state/features/database/initial-document";
import * as A from "@automerge/automerge";
import {StrictReactNode} from "@ben-ryder/jigsaw";
import {localStore} from "../lfb/storage/local-store";
import {ChangeDto, ChangesSocketEvents} from "@ben-ryder/lfb-common";
import {v4 as createUUID} from "uuid";
import {useLogto} from "@logto/react";
import {io, Socket} from "socket.io-client";
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_LFB_SERVER_URL;

export type UserDetails = {
  id: string,
  name: string
}

export interface ApplicationContext {
  loading: boolean,
  document: AthenaDatabase,
  setDocument: (doc: AthenaDatabase) => void,
  makeChange: (changeFunc: A.ChangeFn<AthenaDatabase>) => void,
  userDetails: UserDetails | null,
  online: boolean,
  setOnline: (online: boolean) => void
}

export const ApplicationContext = createContext<ApplicationContext>({
  loading: true,
  document: initialDocument,
  setDocument: (doc: AthenaDatabase) => {},
  makeChange: () => {},
  userDetails: null,
  online: true,
  setOnline: () => {},
});

export interface ApplicationProviderProps {
  children: StrictReactNode
}


export function ApplicationProvider(props: ApplicationProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [document, setDocument] = useState<A.Doc<AthenaDatabase>>(initialDocument);
  const [userDetails, setUserDetails] = useState<UserDetails|null>(null);
  const {isAuthenticated, getIdTokenClaims, getAccessToken} = useLogto();

  const [online, setOnline] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket|null>(null);
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel|null>(null);

  // Hook to do the initial setup and loading
  useEffect(() => {
    async function init() {
      const channel = new BroadcastChannel("changes");
      channel.onmessage = (event: MessageEvent<{type: ChangesSocketEvents.changes, changes: ChangeDto[]}>) => {
        if (event.data.type === ChangesSocketEvents.changes) {
          handleExternalChanges(event.data.changes);
        }
      };
      setBroadcastChannel(broadcastChannel);

      // Setup socket
      const claims = await getIdTokenClaims();
      const userId = claims?.sub
      let soc = io(SERVER_URL, {auth: {userId: userId}});
      soc.on("changes", (payload: {userId: string, changes: ChangeDto[]}) => {
        handleExternalChanges(payload.changes);
      });
      setSocket(soc);

      await loadDocument();
      setLoading(false);
    }
    init()
  }, [localStore, setSocket, setBroadcastChannel]);

  // Hook to trigger a sync
  useEffect(() => {
    syncWithServer();
  }, [socket])

  // Hook to load the user information
  useEffect(() => {
    async function loadUser() {
      const claims = await getIdTokenClaims();
      if (claims) {
        const id = claims.sub;
        const name = claims.name || claims.username || claims.email || "Logged In";
        setUserDetails({id, name});
      }
    }
    loadUser();
  }, [isAuthenticated, getIdTokenClaims]);

  async function loadDocument() {
    const changes = await localStore.loadAllChanges();
    const automergeChanges: Uint8Array[] = [];
    for (const change of changes) {
      const decodedChange = new Uint8Array([...atob(change.data)].map(char => char.charCodeAt(0))) as A.Change;
      automergeChanges.push(decodedChange);
    }

    const [newDocument] = A.applyChanges<AthenaDatabase>(A.clone(initialDocument), automergeChanges);
    setDocument(newDocument);
  }

  async function makeChange(changeFunc: A.ChangeFn<AthenaDatabase>) {
    const updatedDocument = A.change(document, changeFunc);
    const rawChange = A.getLastLocalChange(updatedDocument);
    // todo: can I use a patchCallback rather that fetching the last change maybe?

    // @ts-ignore - todo: fix this being required
    const encodedChange = btoa(String.fromCharCode(...rawChange));

    const change: ChangeDto = {
      id: createUUID(),
      data: encodedChange
    };

    await localStore.saveChange(change);
    setDocument(updatedDocument);

    emitChanges([change]);
  }

  async function handleExternalChanges(changes: ChangeDto[]) {
    const changeIds = await localStore.loadAllChangeIds();
    for (const change of changes) {
      if (!changeIds.includes(change.id)) {
        await localStore.saveChange(change);
      }
    }

    await loadDocument();
  }

  async function syncWithServer() {
    if (!userDetails?.id || !online) {
      return;
    }

    const accessToken = await getAccessToken();

    const localIds = await localStore.loadAllChangeIds();
    const serverIds = await axios<string[]>({
      method: "GET",
      url: `${SERVER_URL}/v1/${userDetails.id}/changes/ids`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => res.data);

    const newIdsOnServer = serverIds.filter(id => !localIds.includes(id));
    const newIdsOnClient = localIds.filter(id => !serverIds.includes(id));

    if (newIdsOnClient.length > 0) {
      const changesForServer = await localStore.loadChanges(newIdsOnClient);
      await emitChanges(changesForServer);
    }

    if (newIdsOnServer.length > 0) {
      const changesFromServer = await axios({
        method: "GET",
        url: `${SERVER_URL}/v1/${userDetails.id}/changes`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          ids: newIdsOnServer
        }
      }).then(res => res.data);


      const changeIds = await localStore.loadAllChangeIds();
      for (const change of changesFromServer) {
        if (!changeIds.includes(change.id)) {
          await localStore.saveChange(change);
        }
      }
    }

    await loadDocument();
  }

  async function emitChanges(changes: ChangeDto[]) {
    if (userDetails?.id && online && socket) {
      socket.emit(ChangesSocketEvents.changes, {userId: userDetails.id, changes});
      return;
    }
    else if (broadcastChannel) {
      broadcastChannel.postMessage({type: ChangesSocketEvents.changes, changes: changes});
    }
  }

  function setOnlineHelper(online: boolean) {
    if (online) {
      syncWithServer();
    }

    setOnline(online);
  }

  return (
    <ApplicationContext.Provider
      value={{
        loading,
        document, setDocument,
        makeChange,
        userDetails,
        online,
        setOnline: setOnlineHelper
      }}
    >
      {loading ? null : props.children}
    </ApplicationContext.Provider>
  )
}

export const useApplication = () => useContext(ApplicationContext);
