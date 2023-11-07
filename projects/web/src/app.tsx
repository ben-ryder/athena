import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";

import "./athena.scss";
import { routes } from "./routes.js";
import { LFBProvider } from "./utils/lfb-context.js";
import { store } from "./state/store.js";

import { GlobalLayout } from "./patterns/layout/global-layout/global-layout.js";

import { HomePage } from "./pages/home.js";
import { PageNotFound } from "./pages/page-not-found.js";
import { NotesPage } from "./pages/notes/notes-page.js";
import { CreateNotePage } from "./pages/notes/create-note-page.js";
import { EditNotePage } from "./pages/notes/edit-note-page.js";
import { WelcomePage } from "./pages/welcome.js";
import { TasksPage } from "./pages/tasks/tasks-page.js";
import { MenuPage } from "./pages/menu.js";
import { TagsPage } from "./pages/tags/tags-page.js";
import { CreateTagPage } from "./pages/tags/create-tag-page.js";
import { EditTagPage } from "./pages/tags/edit-tag-page.js";

export function App() {
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
                {/* Basic Pages */}
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.welcome} element={<WelcomePage />} />
                <Route path={routes.menu} element={<MenuPage />} />

                {/* Notes Routes */}
                <Route
                  path={routes.notes.list}
                  element={<NotesPage />}
                />
                <Route
                  path={routes.notes.create}
                  element={<CreateNotePage />}
                />
                <Route
                  path={routes.notes.edit}
                  element={<EditNotePage />}
                />

                {/* Tags Routes */}
                <Route
                  path={routes.tags.list}
                  element={<TagsPage />}
                />
                <Route
                  path={routes.tags.create}
                  element={<CreateTagPage />}
                />
                <Route
                  path={routes.tags.edit}
                  element={<EditTagPage />}
                />

                {/* Tasks Routes */}
                <Route
                  path={routes.tasks.list}
                  element={<TasksPage />}
                />

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
