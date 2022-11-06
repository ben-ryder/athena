import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';

import { HomePage } from './pages/home';
import {PageNotFound} from "./pages/page-not-found";
import {LogoutPage} from "./pages/user/logout";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {LoginPage} from "./pages/user/login/login";
import {MainPage} from "./pages/main/main-page";
import {ForgottenPasswordPage} from "./pages/user/password/forgotten-password";
import {routes} from "./routes";
import {ResetPasswordPage} from "./pages/user/password/reset-password";
import {RegisterPage} from "./pages/user/register/register";
import {ApplicationManager} from "./helpers/application-manager";
import {UserSettingsPage} from "./pages/user/settings";
import {RequestVerificationPage} from "./pages/user/verify/request-verification";
import {SubmitVerificationPage} from "./pages/user/verify/submit-verification";
import {store} from "./state/store";
import {Provider} from "react-redux";


export function Application() {
  return (
    <Provider store={store}>
      <ApplicationManager>
        <HelmetProvider>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Athena</title>
          </Helmet>
          <BrowserRouter>
            <Routes>
              {/* Home Route */}
              <Route path={routes.home} element={<HomePage />} />

              {/* Public User Routes */}
              <Route path={routes.users.login} element={<LoginPage />} />
              <Route path={routes.users.register} element={<RegisterPage />} />
              <Route path={routes.users.logout} element={<LogoutPage />} />

              <Route path={routes.users.password.forgotten} element={<ForgottenPasswordPage />} />
              <Route path={routes.users.password.reset} element={<ResetPasswordPage />} />

              <Route path={routes.users.verification.request} element={<RequestVerificationPage />} />
              <Route path={routes.users.verification.submit} element={<SubmitVerificationPage />} />

              {/* Main Application */}
              <Route path={routes.app.main} element={<MainPage />} />

              {/* Restricted Routes (requiring online mode and valid user login) */}
              {/* Private User Routes */}
              <Route path={routes.users.settings} element={<UserSettingsPage />} />

              {/* 404 Route */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </ApplicationManager>
    </Provider>
  );
}
