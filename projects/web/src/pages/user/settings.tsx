import React from 'react';

import {MessagePage} from "../../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";


export function UserSettingsPage() {
  return (
    <>
      <Helmet>
        <title>User Settings | Athena</title>
      </Helmet>
      <MessagePage
        heading="User Settings"
        text="Change user settings"
      />
    </>
  );
}

