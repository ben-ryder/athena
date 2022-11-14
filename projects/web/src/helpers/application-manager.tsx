import {application, DocumentContext} from "./application-context";
import {useEffect, useState} from 'react';
import {StrictReactNode} from "../types/strict-react-node";
import {initialDocument} from "../state/features/database/initial-document";
import {AthenaDatabase} from "../state/features/database/athena-database";
import * as A from "@automerge/automerge";

export interface AthenaSessionManagerProps {
  children: StrictReactNode
}

/**
 * A wrapper for managing the application.
 * @constructor
 */
export function ApplicationManager(props: AthenaSessionManagerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  let [document, setDocument] = useState<A.Doc<AthenaDatabase>>(initialDocument);

  useEffect(() => {
    async function init() {
      await application.load();
      application.addUpdateListener(setDocument);
      setLoading(false);
    }
    init()
  }, [application]);

  return (
    <DocumentContext.Provider value={{document, setDocument}}>
      {loading
        ? <p>loading...</p>
        : props.children
      }
    </DocumentContext.Provider>
  )
}