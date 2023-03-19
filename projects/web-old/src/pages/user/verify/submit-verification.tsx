import React from 'react';

import {Helmet} from "react-helmet-async";
import {LoadingPage} from "../../../patterns/pages/loading-page";
import {GeneralQueryStatus} from "../../../types/general-query-status";


export function SubmitVerificationPage() {
  return (
    <>
      <Helmet>
        <title>Verify Account | Athena</title>
      </Helmet>
      <LoadingPage
        status={GeneralQueryStatus.LOADING}
        loadingMessage="Your account is being verified, you should be redirected shortly..."
        emptyMessage="An error occurred"
        errorMessage="An error occurred"
      />
    </>
  );
}

