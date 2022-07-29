import React from 'react';
import {H1, P} from "@ben-ryder/jigsaw";
import {Page} from "../../../patterns/layout/page";
import {routes} from "../../../routes";
import {Link} from "../../../patterns/element/link";


export function RegisterDisabledPage() {
  return (
    <Page>
      <div className="grow flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <H1 className="text-br-teal-600">Registration Disabled</H1>
          <P className="text-br-whiteGrey-200 my-4 max-w-xl text-center">Account registration is currently disabled. It is still possible to self host your own Athena instance, see GitHub for details .
          </P>
          <Link href={routes.external.github}>Go to GitHub</Link>
        </div>
      </div>
    </Page>
  );
}

