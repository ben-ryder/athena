import React, {ReactNode} from 'react';
import {Helmet} from "react-helmet-async";
import {Header} from "../header/header";
export interface GlobalLayoutProps {
  children: ReactNode
}

export function GlobalLayout(props: GlobalLayoutProps) {

  return (
    <div className="ath-root">
      <Helmet>
        <title>{`Application | Athena`}</title>
      </Helmet>

      <Header />

      <main className="ath-main">
          {props.children}
      </main>
    </div>
  )
}
