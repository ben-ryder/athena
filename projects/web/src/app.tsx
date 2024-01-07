import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { routes } from "./routes";

import { MainPage } from "./view/pages/main/main";
import { PageNotFound } from "./view/pages/page-not-found";
import { WelcomePage } from "./view/pages/welcome";

export function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Athena</title>
        </Helmet>
        <Routes>
          {/* Basic Pages */}
          <Route path={routes.main} element={<MainPage />} />
          <Route path={routes.welcome} element={<WelcomePage />} />

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  );
}
