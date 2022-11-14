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
import {ApplicationWrapper} from "./pages/application-wrapper";
import {Callback} from "./pages/user/callback";
import {NotesPage} from "./pages/notes/notes-page";
import {NotesCreatePage} from "./pages/notes/notes-create-page";
import {NotesEditPage} from "./pages/notes/notes-edit-page";

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
            <ApplicationWrapper>
              <BrowserRouter>
                <Routes>
                  {/* Home Route */}
                  <Route path={routes.home} element={<HomePage />} />

                  {/* Notes Routes */}
                  <Route path={routes.content.notes.list} element={<NotesPage />} />
                  <Route path={routes.content.notes.create} element={<NotesCreatePage />} />
                  <Route path={routes.content.notes.edit} element={<NotesEditPage />} />

                  {/* User Login Callback Route */}
                  <Route path={routes.user.callback} element={<Callback />} />

                  {/* 404 Route */}
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </BrowserRouter>
            </ApplicationWrapper>
          </HelmetProvider>
        </ApplicationManager>
      </ReduxProvider>
    </LogtoProvider>
  );
}
