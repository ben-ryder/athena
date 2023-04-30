import React from 'react';

import {routes} from "../routes";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../patterns/pages/message-page/message-page";
import {JButtonLink, JButtonGroup} from "@ben-ryder/jigsaw-react";


export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Athena</title>
      </Helmet>
      <MessagePage
        heading="Welcome to Athena"
        content={
          <>
            <p>Athena is a local-first web app for notes, tasks, journaling, habit tracking and reminders.</p>
            <p>Features like content backup and cross-device sync are only available if you <a href={routes.external.github}>host Athena yourself.</a>{" "}
            This instance is fully functional when you continue offline, but you will be unable to login and use any server features.
            </p>
          </>
        }
        extraContent={
          <JButtonGroup>
            <JButtonLink variant="secondary">Log In</JButtonLink>
            <JButtonLink>Continue Offline</JButtonLink>
          </JButtonGroup>
        }
      />
    </>
  );
}

