import React from 'react';
import {routes} from "../routes";
import {MessagePage} from "../patterns/pages/message-page/message-page";
import {Helmet} from "react-helmet-async";
import {JArrowLink} from "@ben-ryder/jigsaw-react";

export function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>Not Found | Athena</title>
      </Helmet>
      <MessagePage
        heading="Not Found"
        text="The page you requested could not be found."
        extraContent={
          <JArrowLink link={routes.home} direction="left">Back to Home Page</JArrowLink>
        }
      />
    </>
  );
}
