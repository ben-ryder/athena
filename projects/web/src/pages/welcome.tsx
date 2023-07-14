import React from "react";

import { routes } from "../routes";
import { Helmet } from "react-helmet-async";
import { MessagePage } from "../patterns/pages/message-page/message-page";
import { JButtonGroup, JButtonLink } from "@ben-ryder/jigsaw-react";

export function WelcomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Athena</title>
      </Helmet>
      <MessagePage
        heading="Welcome to Athena"
        content={
          <>
            <p>
              Athena is a local-first web app for notes, tasks, journaling,
              habit tracking and reminders.
            </p>
            <p>
              Due to various concerns such as server costs, maintenance effort &
              legal responsibilities I don't host any publicly accessible
              servers for Athena, meaning features like content backup &
              cross-device sync are only available if you{" "}
              <a href={routes.external.github}>host your own server.</a>
              <br />
              This instance is fully functional when you continue offline,
              you'll just be unable to login and use any server features.
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
