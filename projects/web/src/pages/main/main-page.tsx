import React from 'react';
import {Helmet} from "react-helmet-async";
import {useAppDispatch} from "../../state/store";

export function MainPage() {
  return (
    <>
      <Helmet>
        <title>{`Application | Athena`}</title>
      </Helmet>
      <main className="h-[100vh] w-[100vw] bg-br-atom-700 flex">
        <h1>Main App</h1>
      </main>
    </>
  )
}

