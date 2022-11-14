import React from 'react';
import {Link} from "../patterns/element/link";
import {routes} from "../routes";
import {MessagePage} from "../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";


export function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>Route Not Found | Athena</title>
      </Helmet>
      <MessagePage
        heading="Not Found"
        text="The route requested could not be found."
        extraContent={
          <Link href={routes.home}>Go to Home</Link>
        }
      />
    </>
  );
}
