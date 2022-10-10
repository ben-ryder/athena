import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';
import {Page} from "./page";


export interface ContentPageProps {
  children: StrictReactNode
}

export function ContentPage(props: ContentPageProps) {
  return (
    <Page>
      <div className="w-full max-w-3xl mx-auto px-4 pt-12">
        {props.children}
      </div>
    </Page>
  );
}
