import { useAthena } from "./use-athena";
import { useEffect, useState } from 'react';
import {LoadingPage} from "../patterns/pages/loading-page";
import {StrictReactNode} from "../types/strict-react-node";

enum LoginCheckStatus {
    CHECKING = 'checking',
    LOGGED_IN = 'logged-in',
    NOT_LOGGED_IN = 'not-logged-in',
}

export interface AthenaSessionManagerProps {
    children: StrictReactNode
}

/**
 * Application wrapper for managing the current user's session.
 * @constructor
 */
export function AthenaSessionManager(props: AthenaSessionManagerProps) {
    let { currentUser, setCurrentUser, storage } = useAthena();
    const [ loginCheckStatus, setLoginCheckStatus ] = useState(LoginCheckStatus.CHECKING);

    useEffect(() => {
        async function checkUserLogin() {
            if (currentUser) {
                setLoginCheckStatus(LoginCheckStatus.LOGGED_IN);
            }
            else {
                const savedUser = await storage.loadCurrentUser();
                if (!savedUser) {
                    setLoginCheckStatus(LoginCheckStatus.NOT_LOGGED_IN);
                }
                else {
                    setCurrentUser(savedUser);
                }
            }
        }
        checkUserLogin();
    }, [currentUser, storage]);

    if (loginCheckStatus === LoginCheckStatus.CHECKING) {
        return <LoadingPage text="Loading application..." />
    }
    else {
        return <>{props.children}</>
    }
}
