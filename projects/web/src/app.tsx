import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { routes } from "./routes";

import { MainPage } from "./pages/main/main";
import { PageNotFound } from "./pages/page-not-found";
import { WelcomePage } from "./pages/welcome";

import "./app.scss"

export function App() {
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

					{/* 404 Route */}
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</HelmetProvider>
		</BrowserRouter>
	);
}
