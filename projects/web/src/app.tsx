import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';

import { HomePage } from './pages/home';
import {PageNotFound} from "./pages/page-not-found";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {routes} from "./routes";
import {ApplicationManager} from "./helpers/application-manager";
import {store} from "./state/store";
import {Provider as ReduxProvider} from "react-redux";
import { LogtoProvider, LogtoConfig } from '@logto/react';
import {Application} from "./pages/application";
import {Callback} from "./pages/callback";

const config: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
};


export function Index() {
  return (
    <LogtoProvider config={config}>
      <ReduxProvider store={store}>
        <ApplicationManager>
          <HelmetProvider>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Athena</title>
            </Helmet>
            <Application>
              <BrowserRouter>
                <Routes>
                  {/* Home Route */}
                  <Route path={routes.home} element={<HomePage />} />

                  {/* 404 Route */}
                  <Route path={routes.user.callback} element={<Callback />} />

                  {/* 404 Route */}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </BrowserRouter>
            </Application>
          </HelmetProvider>
        </ApplicationManager>
      </ReduxProvider>
    </LogtoProvider>
  );
}
