import {useApplication} from "./application-context";
import {useEffect, useState} from 'react';
import {StrictReactNode} from "../types/strict-react-node";
import {initialDocument} from "../state/features/database/initial-document";
import {AthenaDatabase} from "../state/features/database/athena-database";

export interface AthenaSessionManagerProps {
  children: StrictReactNode
}

/**
 * A wrapper for managing the application.
 * @constructor
 */
export function ApplicationManager(props: AthenaSessionManagerProps) {
  let { application } = useApplication();
  let [document, setDocument] = useState<AthenaDatabase>(initialDocument);

  useEffect(() => {
    async function init() {
      await application.init();
      await application.setupServer(import.meta.env.VITE_LFB_SERVER_URL);
      application.addUpdateListener(setDocument);
    }
    init()
  }, [application]);

  return (
      <>{props.children}</>
  )
}
