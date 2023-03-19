import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {useLFBApplication} from "../../helpers/lfb-context";

// todo: add error handling/display message
export function LogoutPage() {
    const navigate = useNavigate();
    const { lfbClient, currentUser, setCurrentUser } = useLFBApplication();

    useEffect(() => {
        async function logout() {
          if (currentUser) {
            await lfbClient.logout();
            setCurrentUser(null);
          }

          await navigate(routes.home);
        }
        logout();
    }, [lfbClient, navigate]);

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

