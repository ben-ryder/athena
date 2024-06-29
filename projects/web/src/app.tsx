import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { routes } from "./routes";

import { MainPage } from "./pages/main/main";
import { PageNotFound } from "./pages/page-not-found";
import { WelcomePage } from "./pages/welcome";
import { UnderDevelopmentPage } from "./pages/under-development/under-development";

import "./app.scss"

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

					{/* 404 Route */}
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</HelmetProvider>
		</BrowserRouter>
	);
}
