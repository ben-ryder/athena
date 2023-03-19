import React from 'react';

import {Button} from "@ben-ryder/jigsaw";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../../../patterns/pages/message-page";


export function RequestVerificationPage() {
  return (
    <>
      <Helmet>
        <title>Verify Account | Athena</title>
      </Helmet>
      <MessagePage
        heading="Verify Account"
        text="You must verify your account email before you can use Athena."
        extraContent={
          <Button>Request Verification Email</Button>
        }
      />
    </>
  );
}

