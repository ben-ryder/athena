import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';
import {Helmet} from "react-helmet-async";
import { H1 } from "@ben-ryder/jigsaw";
import {Page} from "./page";


export interface FormPageProps {
  title: string,
  description?: string | StrictReactNode,
  children: StrictReactNode
}

export function FormPage(props: FormPageProps) {
  const description = typeof props.description === 'string' ? <p>{props.description}</p> : props.description;

  return (
    <Page>
      <Helmet>
        <title>{`${props.title} | Athena`}</title>
      </Helmet>
      <div className="grow flex flex-col justify-center items-center">
        <main className="w-96 mx-auto mb-10 px-2">
          <div>
            <H1 className="text-br-teal-600">{props.title}</H1>
            {props.description && description}
          </div>
          <div className="mt-6">
            {props.children}
          </div>
        </main>
      </div>
    </Page>
  );
}
