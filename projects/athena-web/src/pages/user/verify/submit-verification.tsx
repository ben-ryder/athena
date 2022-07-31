import React from 'react';

import {Helmet} from "react-helmet-async";
import {LoadingPage} from "../../../patterns/pages/loading-page";


export function SubmitVerificationPage() {
  return (
    <>
      <Helmet>
        <title>Verify Account | Athena</title>
      </Helmet>
      <LoadingPage text="Your account is being verified, you should be redirected shortly..." />
    </>
  );
}

