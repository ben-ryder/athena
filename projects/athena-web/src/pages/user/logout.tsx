import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {P} from "@ben-ryder/jigsaw";
import {LoadingIcon} from "../../patterns/element/loading-icon";
import {LoadingPage} from "../../patterns/layout/loading-page";


export function LogoutPage() {
    const navigate = useNavigate();
    const { apiClient } = useAthena();

    useEffect(() => {
        async function logout() {
            await apiClient.logout();
            await navigate("/");
        }
        logout();
    }, [apiClient, navigate]);

    return (
      <LoadingPage text="You are being logged out and should be redirected shortly..." />
    );
}

