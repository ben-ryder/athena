import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';
import { H1 } from "@ben-ryder/jigsaw";

export interface FormPageProps {
  title: string,
  description?: string | StrictReactNode,
  children: StrictReactNode
}

export function FormPage(props: FormPageProps) {
  const description = typeof props.description === 'string' ? <p>{props.description}</p> : props.description;

  return (
    <div className="h-full grow flex flex-col justify-center items-center">
      <main className="mb-10 px-2 md:w-[35rem] mx-auto">
        <div>
          <H1 className="text-br-teal-600">{props.title}</H1>
          {props.description && description}
        </div>
        <div className="mt-6">
          {props.children}
        </div>
      </main>
    </div>
  );
}
