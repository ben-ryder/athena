import React from "react";

import { routes } from "../routes";
import { Helmet } from "react-helmet-async";
import { MessagePage } from "../patterns/layout/message-page/message-page";
import { JButtonGroup, JButtonLink } from "@ben-ryder/jigsaw-react";

export function WelcomePage() {
  return (
    <>
      <Helmet>
        <title>Welcome | Athena</title>
      </Helmet>
      <MessagePage
        heading="Welcome to Athena"
        content={
          <>
            <p>
              Athena is a local-first web app for creating customizable content databases, suitable for note-taking, task-management, personal knowledge bases and more.<br/>
              For help, support and documentation <a href={routes.external.github} target="_blank">visit the project GitHub</a>.
            </p>
            <p>
              Features such as cloud backups and cross-device sync can be enabled by <a href={routes.external.selfHostDocs}>hosting your own server</a>{" "}
              and then using this web app or your own self-hosted version.
            </p>
            <p>
              If this is your first time using Athena you can use the <b>"Load Example"</b> option below.{" "}
              This will create an example database containing some initial content types to get you started.
            </p>
          </>
        }
        extraContent={
          <JButtonGroup>
            <JButtonLink variant="secondary">Load Example</JButtonLink>
            <JButtonLink href={routes.main}>Go to App</JButtonLink>
          </JButtonGroup>
        }
      />
    </>
  );
}
