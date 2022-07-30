import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {routes} from "../../routes";


export function LogoutPage() {
    const navigate = useNavigate();
    const { apiClient, setCurrentUser } = useAthena();

    useEffect(() => {
        async function logout() {
            await apiClient.logout();
            setCurrentUser(null);
            await navigate(routes.home);
        }
        logout();
    }, [apiClient, navigate]);

    return (
      <LoadingPage text="You are being logged out and should be redirected shortly..." />
    );
}

