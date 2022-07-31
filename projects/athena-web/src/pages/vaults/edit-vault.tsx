import React from 'react';

import {MessagePage} from "../../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";


export function EditVaultPage() {
  return (
    <>
      <Helmet>
        <title>Edit Vault | Athena</title>
      </Helmet>
      <MessagePage
        heading="Edit Vault"
        text="Edit a new vault"
      />
    </>
  );
}

