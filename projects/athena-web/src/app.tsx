import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';

import { HomePage } from './pages/home';
import {AthenaRestrictedRoute} from "./helpers/athena-restricted-route";
import {PageNotFound} from "./pages/page-not-found";
import {LogoutPage} from "./pages/user/logout";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {LoginPage} from "./pages/user/login";
import {MainPage} from "./pages/main/main";
import {ForgottenPasswordPage} from "./pages/user/password/forgotten-password";
import {routes} from "./routes";
import {ResetPasswordPage} from "./pages/user/password/reset-password";
import {RegisterPage} from "./pages/user/register/register";


export function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Athena</title>
      </Helmet>
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path={routes.home} element={<HomePage />} />

          <Route path="/main" element={<MainPage />}/>

          {/* User Routes */}
          <Route path={routes.users.logout} element={<LogoutPage />} />
          <Route path={routes.users.login} element={<LoginPage />} />
          <Route path={routes.users.register} element={<RegisterPage />} />
          <Route path={routes.users.password.forgotten} element={<ForgottenPasswordPage />} />
          <Route path={routes.users.password.reset} element={<ResetPasswordPage />} />


          {/* Restricted Routes (requiring encryption and user login) */}
          <Route element={<AthenaRestrictedRoute />}>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
