import React from 'react';
import {H1, P} from "@ben-ryder/jigsaw";
import {StrictReactNode} from "../../types/strict-react-node";

export interface MessagePageProps {
  heading: string,
  text: string | StrictReactNode,
  extraContent?: StrictReactNode
}

export function MessagePage(props: MessagePageProps) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <H1 className="text-br-teal-600">{props.heading}</H1>
        <P className="text-br-whiteGrey-200 my-4 max-w-sm text-center max-w-xl text-center">{props.text}</P>
        {props.extraContent && props.extraContent}
      </div>
    );
}

