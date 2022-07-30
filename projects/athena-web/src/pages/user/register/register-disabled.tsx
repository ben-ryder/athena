import React from 'react';
import {routes} from "../../../routes";
import {Link} from "../../../patterns/element/link";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../../../patterns/pages/message-page";


export function RegisterDisabledPage() {
  return (
    <>
      <Helmet>
        <title>Registration Disabled | Athena</title>
      </Helmet>
      <MessagePage
        heading="Registration Disabled"
        text={
          <>Account registration is currently disabled. It is still possible to self host your own Athena instance though. <Link href={routes.external.github}>Learn more on GitHub</Link>.</>
        }
      />
    </>
  );
}

