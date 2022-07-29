import React from 'react';

import {H0, LinkButton, P} from "@ben-ryder/jigsaw";
import {Link} from "../patterns/element/link";
import {routes} from "../routes";


export function HomePage() {
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <H0 className="text-br-teal-600">Athena</H0>
        <P className="text-br-whiteGrey-200 my-4 max-w-sm text-center">
          A place for encrypted notes, list and reminders.
          Learn more on <Link href={routes.external.github}>GitHub</Link>.
        </P>
        <div className="mt-4">
          <LinkButton className="mx-2" href={routes.users.register} styling="secondary">Register</LinkButton>
          <LinkButton className="mx-2" href={routes.users.login}>Log In</LinkButton>
        </div>
      </div>
    </div>
  );
}

