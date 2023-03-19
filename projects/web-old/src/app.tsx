import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';

import { HomePage } from './pages/home';
import {PageNotFound} from "./pages/page-not-found";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {routes} from "./routes";
import {LFBProvider} from "./helpers/lfb-context";
import {store} from "./state/store";
import {Provider as ReduxProvider} from "react-redux";
import {GlobalLayout} from "./pages/global-layout";
import {NotesPage} from "./pages/notes/notes-page";
import {CreateNotePage} from "./pages/notes/create-note-page";
import {EditNotePage} from "./pages/notes/edit-note-page";
import {TasksPage} from "./pages/tasks/tasks-page";
import {CreateTaskListPage} from "./pages/tasks/create-task-page";
import {EditTaskListPage} from "./pages/tasks/edit-task-page";
import {ViewTaskListPage} from "./pages/tasks/view-task-page";
import {LoginPage} from "./pages/user/login/login";
import {RegisterPage} from "./pages/user/register/register";
import {LogoutPage} from "./pages/user/logout";
import {ForgottenPasswordPage} from "./pages/user/password/forgotten-password";
import {ResetPasswordPage} from "./pages/user/password/reset-password";
import {RequestVerificationPage} from "./pages/user/verify/request-verification";
import {SubmitVerificationPage} from "./pages/user/verify/submit-verification";

export function Index() {
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

                {/* Public User Routes */}
                <Route path={routes.users.login} element={<LoginPage />} />
                <Route path={routes.users.register} element={<RegisterPage />} />
                <Route path={routes.users.logout} element={<LogoutPage />} />

                <Route path={routes.users.password.forgotten} element={<ForgottenPasswordPage />} />
                <Route path={routes.users.password.reset} element={<ResetPasswordPage />} />

                <Route path={routes.users.verification.request} element={<RequestVerificationPage />} />
                <Route path={routes.users.verification.submit} element={<SubmitVerificationPage />} />

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
