import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";

import "./athena.scss";
import { routes } from "./routes";
import { LFBProvider } from "./utils/lfb-context";
import { store } from "./state/application-state";

import { GlobalLayout } from "./patterns/layout/global-layout/global-layout";

import { HomePage } from "./pages/home";
import { PageNotFound } from "./pages/page-not-found";
import { WelcomePage } from "./pages/welcome";
import { AttachmentsManagerPage } from "./pages/attachments/attachments-manager";

export function App() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <LFBProvider>
          <HelmetProvider>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Athena</title>
            </Helmet>
            <GlobalLayout>
              <Routes>
                {/* Basic Pages */}
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.welcome} element={<WelcomePage />} />

                <Route
                  path={routes.attachments}
                  element={<AttachmentsManagerPage />}
                />

                {/* 404 Route */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </GlobalLayout>
          </HelmetProvider>
        </LFBProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
}
