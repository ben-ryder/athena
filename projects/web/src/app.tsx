import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { routes } from "./routes";

import { MainPage } from "./view/pages/main/main";
import { PageNotFound } from "./view/pages/page-not-found";
import { WelcomePage } from "./view/pages/welcome";
import {PerformancePage} from "./view/pages/performance/performance";
import { UnderDevelopmentPage } from "./view/pages/under-development/under-development";

export function App() {
  const [showDevPage, setShowDevPage] = useState<boolean>(true)

  useEffect(() => {
    const athenaFlag = localStorage.getItem("athena")
    if (athenaFlag) {
      setShowDevPage(false)
    }
  }, [])

  if (showDevPage) {
    return <UnderDevelopmentPage />
  }

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

          <Route path={routes.performance} element={<PerformancePage />} />

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  );
}
