import {Navigate, Outlet} from "react-router-dom";
import {routes} from "../routes";


/**
 * A route wrapper that can redirect users to the main page if the app isn't in online mode.
 * @constructor
 */
export function AthenaOnlineRoute() {
    if (import.meta.env.VITE_ONLINE_MODE !== "true") {
        return <Navigate to={routes.app.main} state={{ from: location }} />;
    }

    return <Outlet/>
}
