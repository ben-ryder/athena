import React from 'react';

import {routes} from "../routes";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../patterns/pages/message-page/message-page";
import {JButtonLink, JButtonGroup} from "@ben-ryder/jigsaw-react";


export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | Athena</title>
      </Helmet>
    </>
  );
}

