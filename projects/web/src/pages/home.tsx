import React, {useEffect} from 'react';

import {LinkButton} from "@ben-ryder/jigsaw";
import {Link} from "../patterns/element/link";
import {routes} from "../routes";
import {Helmet} from "react-helmet-async";
import {MessagePage} from "../patterns/pages/message-page";
import {useAthena} from "../helpers/use-athena";
import {useNavigate} from "react-router-dom";


export function HomePage() {
  const navigate = useNavigate();
  const {currentUser} = useAthena();

  useEffect(() => {
    if (currentUser) {
      navigate(routes.app.main);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | Athena</title>
      </Helmet>
      <MessagePage
        heading="Athena"
        text={<>A place for encrypted notes, list and reminders. Learn more on <Link href={routes.external.github}>GitHub</Link>.</>}
        extraContent={
          <>
            <div className="flex">
              <LinkButton className="mx-2" href={routes.users.register} styling="secondary">Register</LinkButton>
              <LinkButton className="mx-2" href={routes.users.login}>Log In</LinkButton>
            </div>
            <div className="mt-8">
              <Link href={routes.app.main}>Continue without account</Link>
            </div>
          </>
        }
      />
    </>
  );
}

