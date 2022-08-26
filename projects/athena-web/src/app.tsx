import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';

import {HomePage} from "./pages/home";
import {MainPage} from "./main/main";
import {PageNotFound} from "./pages/page-not-found";
import {Helmet, HelmetProvider} from "react-helmet-async";

export function App() {
  return (
      <HelmetProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Athena</title>
        </Helmet>
        <BrowserRouter>
          <Routes>
            {/* Home Route */}
            <Route path={"/"} element={<HomePage />} />

            <Route path="/app" element={<MainPage />} />

            {/* 404 Route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
  );
}
