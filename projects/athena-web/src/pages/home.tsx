import React from 'react';

import {LinkButton} from "@ben-ryder/jigsaw";
import {Link} from "../patterns/element/link";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../patterns/pages/message-page";
import {routes} from "../routes";


export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Athena</title>
      </Helmet>
      <MessagePage
        heading="Athena"
        text={<>A place for encrypted notes, list and reminders. Learn more on <Link href={routes.external.github}>GitHub</Link>.</>}
        extraContent={
          <div className="flex">
            <LinkButton className="mx-2" href={routes.app}>Open App</LinkButton>
          </div>
        }
      />
    </>
  );
}

