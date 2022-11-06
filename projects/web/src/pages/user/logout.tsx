import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useApplication} from "../../helpers/application-context";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {GeneralQueryStatus} from "../../types/general-query-status";

// todo: add error handling/display message
export function LogoutPage() {
    const navigate = useNavigate();
    const { application } = useApplication();

    useEffect(() => {
        async function logout() {
            await application.logout();
            await navigate(routes.home);
        }
        logout();
    }, [application, navigate]);

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

