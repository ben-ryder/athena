import React from 'react';

import {LinkButton} from "@ben-ryder/jigsaw";
import {Link} from "../patterns/element/link";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../patterns/pages/message-page";


export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Athena</title>
      </Helmet>
      <MessagePage
        heading="Athena"
        text={<>A place for encrypted notes, list and reminders. Learn more on <Link href="https://github.com/Ben-Ryder/athena">GitHub</Link>.</>}
        extraContent={
          <div className="flex">
            <LinkButton className="mx-2" href="/main">Open App</LinkButton>
          </div>
        }
      />
    </>
  );
}

