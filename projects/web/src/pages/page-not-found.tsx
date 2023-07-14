import React from "react";
import { routes } from "../routes";
import { MessagePage } from "../patterns/pages/message-page/message-page";
import { Helmet } from "react-helmet-async";
import { JArrowLink } from "@ben-ryder/jigsaw-react";
import { InternalLink } from "../patterns/components/internal-link";

export function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>Not Found | Athena</title>
      </Helmet>
      <MessagePage
        heading="Not Found"
        content={<p>The page you requested could not be found.</p>}
        extraContent={
          <JArrowLink href={routes.home} direction="left" as={InternalLink}>
            Back to Home Page
          </JArrowLink>
        }
      />
    </>
  );
}
