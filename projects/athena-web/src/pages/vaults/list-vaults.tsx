import React from 'react';

import {MessagePage} from "../../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";


export function ListVaultsPage() {
  return (
    <>
      <Helmet>
        <title>Vaults | Athena</title>
      </Helmet>
      <MessagePage
        heading="Vaults List"
        text="A list of vaults"
      />
    </>
  );
}

