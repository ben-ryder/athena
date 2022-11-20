import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';

import { HomePage } from './pages/home';
import {PageNotFound} from "./pages/page-not-found";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {routes} from "./routes";
import {ApplicationProvider} from "./helpers/application-context";
import {store} from "./state/store";
import {Provider as ReduxProvider} from "react-redux";
import { LogtoProvider, LogtoConfig } from '@logto/react';
import {GlobalLayout} from "./pages/global-layout";
import {Callback} from "./pages/user/callback";
import {NotesPage} from "./pages/notes/notes-page";
import {CreateNotePage} from "./pages/notes/create-note-page";
import {EditNotePage} from "./pages/notes/edit-note-page";
import {TasksPage} from "./pages/tasks/tasks-page";
import {CreateTaskListPage} from "./pages/tasks/create-task-page";
import {EditTaskListPage} from "./pages/tasks/edit-task-page";
import {ViewTaskListPage} from "./pages/tasks/view-task-page";

const config: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
};


export function Index() {
  return (
    <LogtoProvider config={config}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <ApplicationProvider>
          <HelmetProvider>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Athena</title>
            </Helmet>
            <GlobalLayout>
              <Routes>
                {/* Home Route */}
                <Route path={routes.home} element={<HomePage />} />

                {/* Notes Routes */}
                <Route path={routes.content.notes.list} element={<NotesPage />} />
                <Route path={routes.content.notes.create} element={<CreateNotePage />} />
                <Route path={routes.content.notes.edit} element={<EditNotePage />} />

                {/* Task List Routes */}
                <Route path={routes.content.tasks.list} element={<TasksPage />} />
                <Route path={routes.content.tasks.create} element={<CreateTaskListPage />} />
                <Route path={routes.content.tasks.edit} element={<EditTaskListPage />} />
                <Route path={routes.content.tasks.view} element={<ViewTaskListPage />} />

                {/* User Login Callback Route */}
                <Route path={routes.user.callback} element={<Callback />} />

                {/* 404 Route */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </GlobalLayout>
          </HelmetProvider>
        </ApplicationProvider>
        </BrowserRouter>
      </ReduxProvider>
    </LogtoProvider>
  );
}
