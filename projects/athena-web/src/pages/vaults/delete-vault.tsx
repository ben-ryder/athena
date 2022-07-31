import React from 'react';

import {MessagePage} from "../../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";


export function DeleteVaultPage() {
  return (
    <>
      <Helmet>
        <title>Delete Vault | Athena</title>
      </Helmet>
      <MessagePage
        heading="Delete Vault"
        text="Delete a new vault"
      />
    </>
  );
}

