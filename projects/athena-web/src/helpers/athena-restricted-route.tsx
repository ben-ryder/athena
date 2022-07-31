import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useAthena } from "./use-athena";
import {routes} from "../routes";


/**
 * A route wrapper that can redirect users if they are not logged in.
 * @constructor
 */
export function AthenaRestrictedRoute() {
    let { currentUser } = useAthena();
    const location = useLocation();

    if (currentUser && !currentUser.isVerified) {
        return <Navigate to={routes.users.verification.request} />;
    }
    else if (currentUser) {
        return <Outlet/>
    }
    else {
        return <Navigate to={routes.home} state={{ from: location }} />;
    }
}
