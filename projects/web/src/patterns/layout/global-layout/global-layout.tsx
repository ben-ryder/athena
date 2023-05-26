import React, {ReactNode} from 'react';
import {Helmet} from "react-helmet-async";
import {
  FileText as NotesIcon,
  ListChecks as TasksIcon,
  Tag as TagsIcon,
  CalendarRange as JournalIcon,
  MoreHorizontal as MobileMenuIcon, MoreHorizontal
} from "lucide-react";
import {routes} from "../../../routes";

export interface GlobalLayoutProps {
  children: ReactNode
}

export function AccountIcon() {
  // this is the lucide-react UserCircle2 icon, but it doesn't appear in the react package
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-circle-2">
      <path d="M18 20a6 6 0 0 0-12 0"></path>
      <circle cx="12" cy="10" r="4"></circle>
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  )
}

export function GlobalLayout(props: GlobalLayoutProps) {

  return (
    <div className="ath-root">
      <Helmet>
        <title>{`Application | Athena`}</title>
      </Helmet>

      <div className="ath-layout">
        <div className="ath-menu-bar">
          <div className="ath-menu-bar__logo">
            <span className="logo"></span>
            <p>Athena</p>
          </div>
          <div className="ath-menu-bar__menu">
            <a href={routes.content.notes.list} className="ath-menu-bar__menu-link ath-menu-bar__menu-link--active">
              <NotesIcon />
              <span>Notes</span>
            </a>
            <a href={routes.content.tasks.list} className="ath-menu-bar__menu-link">
              <TasksIcon />
              <span>Tasks</span>
            </a>
            <a href={routes.content.journal.list} className="ath-menu-bar__menu-link">
              <JournalIcon />
              <span>Journal</span>
            </a>
            <a href={routes.organisation.tags.list} className="ath-menu-bar__menu-link ath-menu-bar__menu-link--more">
              <MoreHorizontal />
              <span>More</span>
            </a>
            <a href={routes.organisation.tags.list} className="ath-menu-bar__menu-link ath-menu-bar__menu-link--account">
              <AccountIcon />
              <span>Account</span>
            </a>
          </div>
        </div>
        <main className="ath-main">
          {props.children}
        </main>
      </div>
    </div>
  )
}
