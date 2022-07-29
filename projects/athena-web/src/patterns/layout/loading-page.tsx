import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {P} from "@ben-ryder/jigsaw";
import {LoadingIcon} from "../element/loading-icon";
import {Page} from "./page";

export interface LoadingPageProps {
    text: string
}

export function LoadingPage(props: LoadingPageProps) {
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
      <Page>
          <div className="grow flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center">
                <LoadingIcon />
                <P className="text-br-whiteGrey-200 mt-4">{props.text}</P>
            </div>
        </div>
      </Page>
    );
}

