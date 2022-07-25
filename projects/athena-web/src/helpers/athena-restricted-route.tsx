import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useAthena } from "./use-athena";
import { useEffect, useState } from 'react';

enum LoginCheckStatus {
    CHECKING = 'checking',
    LOGGED_IN = 'logged-in',
    NOT_LOGGED_IN = 'not-logged-in',
}

/**
 * A route wrapper that can redirect users if they are not logged in.
 * @constructor
 */
export function AthenaRestrictedRoute() {
    let { getCurrentUser } = useAthena();
    const location = useLocation();
    const [ loginCheckStatus, setLoginCheckStatus ] = useState(LoginCheckStatus.CHECKING);

    useEffect(() => {
        async function checkUserLogin() {
            const currentUser = await getCurrentUser();

            if (currentUser) {
                setLoginCheckStatus(LoginCheckStatus.LOGGED_IN)
            }
            else {
                setLoginCheckStatus(LoginCheckStatus.NOT_LOGGED_IN)
            }
        }
        checkUserLogin();
    }, [getCurrentUser]);

    if (loginCheckStatus === LoginCheckStatus.CHECKING) {
        return null;
    }
    else if (loginCheckStatus === LoginCheckStatus.NOT_LOGGED_IN) {
        return <Navigate to="/user/login" state={{ from: location }} />;
    }
    else {
        return <Outlet />
    }
}
