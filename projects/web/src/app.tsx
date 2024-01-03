import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";

import "./athena.scss";
import { routes } from "./routes";
import { LFBProvider } from "./utils/lfb-context";
import { store } from "./state/application-state";

import { GlobalLayout } from "./patterns/layout/global-layout/global-layout";

import { MainPage } from "./pages/main";
import { PageNotFound } from "./pages/page-not-found";
import { WelcomePage } from "./pages/welcome";
import {AboutPage} from "./pages/about";
import {PoliciesPage} from "./pages/policies";

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
                <Route path={routes.main} element={<MainPage />} />
                <Route path={routes.welcome} element={<WelcomePage />} />
                <Route path={routes.about} element={<AboutPage />} />
                <Route path={routes.policies} element={<PoliciesPage />} />

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
