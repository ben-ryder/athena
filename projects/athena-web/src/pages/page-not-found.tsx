import React from 'react';
import {Link} from "../patterns/element/link";
import {MessagePage} from "../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";


export function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Athena</title>
      </Helmet>
      <MessagePage
        heading="Page Not Found"
        text="The page you requested could not be found."
        extraContent={
          <Link href="/">Go to Homepage</Link>
        }
      />
    </>
  );
}
