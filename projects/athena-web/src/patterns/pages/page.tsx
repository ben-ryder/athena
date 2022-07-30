import React from 'react';
import { StrictReactNode } from '../../types/strict-react-node';

import { Header } from '../regions/header';


export interface PageProps {
  children: StrictReactNode
}

export function Page(props: PageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-br-atom-700">
      <Header />
      <div className="grow relative flex flex-col">
        {props.children}
      </div>
    </div>
  );
}
