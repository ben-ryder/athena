import React from 'react';
import {routes} from "../../../routes";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../../../patterns/pages/message-page";
import {Link} from "@ben-ryder/jigsaw";
import {InternalLink} from "../../../helpers/internal-link";


export function RegisterDisabledPage() {
  return (
    <>
      <Helmet>
        <title>Registration Disabled | Athena</title>
      </Helmet>
      <MessagePage
        heading="Registration Disabled"
        text={
          <>Account registration is currently disabled. It is still possible to self host your own Athena instance though. <Link as={InternalLink} href={routes.external.github}>Learn more on GitHub</Link>.</>
        }
      />
    </>
  );
}

