import React from 'react';

import {Link} from "@ben-ryder/jigsaw";
import {routes} from "../routes";
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
        text={<>A place for encrypted notes and task lists. Learn more on <Link href={routes.external.github}>GitHub</Link>.</>}
        extraContent={<></>}
      />
    </>
  );
}

