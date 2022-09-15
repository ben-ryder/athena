import React from 'react';
import './styles/tailwind.css';

import {MainPage} from "./main/main";
import {Helmet, HelmetProvider} from "react-helmet-async";

export function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Athena</title>
      </Helmet>
      <MainPage />
    </HelmetProvider>
  );
}
