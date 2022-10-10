import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {GeneralQueryStatus} from "../../types/general-query-status";

// todo: add error handling/display message
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
      <>
          <Helmet>
              <title>Logging out... | Athena</title>
          </Helmet>
          <LoadingPage
            status={GeneralQueryStatus.LOADING}
            loadingMessage="You are being logged out and should be redirected shortly..."
            errorMessage="An error occurred"
            emptyMessage="An error occurred"
          />
      </>
    );
}

