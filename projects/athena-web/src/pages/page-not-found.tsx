import React from 'react';
import {H0, P} from "@ben-ryder/jigsaw";
import {Link} from "../patterns/element/link";
import {routes} from "../routes";


export function PageNotFound() {
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <H0 className="text-br-teal-600">Page Not Found</H0>
        <P className="text-br-whiteGrey-200 my-4">The page you requested could not be found.</P>
        <Link href={routes.home}>Go to Homepage</Link>
      </div>
    </div>
  );
}

