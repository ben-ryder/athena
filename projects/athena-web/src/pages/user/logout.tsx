import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {P} from "@ben-ryder/jigsaw";
import {LoadingIcon} from "../../patterns/element/loading-icon";


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
        <div className="h-[100vh] w-[100vw] flex justify-center items-center">
            <div className="flex flex-col items-center justify-center">
                <LoadingIcon />
                <P className="text-br-whiteGrey-200 mt-4">You are being logged out and should be redirected shortly.</P>
            </div>
        </div>
    );
}

