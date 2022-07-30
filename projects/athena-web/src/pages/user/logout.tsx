import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {LoadingPage} from "../../patterns/pages/loading-page";


export function LogoutPage() {
    const navigate = useNavigate();
    const { apiClient, storage } = useAthena();

    useEffect(() => {
        async function logout() {
            await storage.clear();
            await apiClient.logout();
            await navigate("/");
        }
        logout();
    }, [apiClient, navigate]);

    return (
      <LoadingPage text="You are being logged out and should be redirected shortly..." />
    );
}

