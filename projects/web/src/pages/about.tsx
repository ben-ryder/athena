import React from "react";
import { routes } from "../routes";
import { MessagePage } from "../patterns/pages/message-page/message-page";
import { Helmet } from "react-helmet-async";
import { JArrowLink } from "@ben-ryder/jigsaw-react";
import { SmartLink } from "../patterns/components/smart-link";

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About | Athena</title>
      </Helmet>
      <MessagePage
        heading="About Athena"
        content={<p>TODO</p>}
        extraContent={
          <JArrowLink href={routes.main} as={SmartLink} variant="minimal">
            Back to App
          </JArrowLink>
        }
      />
    </>
  );
}
