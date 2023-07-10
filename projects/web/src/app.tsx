import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Helmet, HelmetProvider} from "react-helmet-async";
import {Provider as ReduxProvider} from "react-redux";

import "./athena.scss"
import {routes} from "./routes";
import {LFBProvider} from "./utils/lfb-context";
import {store} from "./state/store";

import {GlobalLayout} from "./patterns/layout/global-layout/global-layout";

import {HomePage} from './pages/home';
import {PageNotFound} from "./pages/page-not-found";
import {NotesPage} from "./pages/notes/notes-page";
import {CreateNotePage} from "./pages/notes/create-note-page";
import {EditNotePage} from "./pages/notes/edit-note-page";
import {WelcomePage} from "./pages/welcome";
import {TasksPage} from "./pages/tasks/tasks-page";
import {MenuPage} from "./pages/menu";
import {TagsPage} from "./pages/tags/tags-page";
import {CreateTagPage} from "./pages/tags/create-tag-page";
import {EditTagPage} from "./pages/tags/edit-tag-page";

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
                <Route path={routes.content.notes.list} element={<NotesPage />} />
                <Route path={routes.content.notes.create} element={<CreateNotePage />} />
                <Route path={routes.content.notes.edit} element={<EditNotePage />} />

                {/* Tags Routes */}
                <Route path={routes.organisation.tags.list} element={<TagsPage />} />
                <Route path={routes.organisation.tags.create} element={<CreateTagPage />} />
                <Route path={routes.organisation.tags.edit} element={<EditTagPage />} />

                {/* Tasks Routes */}
                <Route path={routes.content.tasks.list} element={<TasksPage />} />

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
