import React, {ReactNode} from 'react';
import {Helmet} from "react-helmet-async";
import {
  FileText as NotesIcon,
  ListChecks as TasksIcon,
  CalendarRange as JournalIcon,
  MoreHorizontal as MobileMenuIcon,
  Tag as TagsIcon,
  Settings as SettingsIcon,
  Triangle as LogoIcon, LucideIcon,
  HelpCircle as HelpIcon
} from "lucide-react";
import {routes} from "../../../routes";
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import classNames from "classnames";

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

export interface MainMenuLinkProps {
  Icon: LucideIcon,
  label: string,
  href: string,
  modifier?: stringm
  target?: "_self" | "_blank" | "_parent" | "_top" | string
}
export function MainMenuLink(props: MainMenuLinkProps) {
  let resolved = useResolvedPath(props.href);
  let match = useMatch({path: resolved.pathname, end: false});

  const className = classNames(
    "ath-menu-bar__menu-link",
    props.modifier ? `ath-menu-bar__menu-link--${props.modifier}` : "",
    {
      "ath-menu-bar__menu-link--active": match
    }
  )

  return (
    <Link to={props.href} className={className} target={props.target}>
      <props.Icon />
      <span>{props.label}</span>
    </Link>
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
          <Link to="/" className="ath-menu-bar__logo">
            <span className="logo">
              <LogoIcon size={32}/>
            </span>
            <p>Athena</p>
          </Link>
          <div className="ath-menu-bar__menu">
            <MainMenuLink
              label="Notes"
              href={routes.content.notes.list}
              Icon={NotesIcon}
            />
            <MainMenuLink
              label="Tasks"
              href={routes.content.tasks.list}
              Icon={TasksIcon}
            />
            <MainMenuLink
              label="Journal"
              href={routes.content.journal.list}
              Icon={JournalIcon}
            />


            <MainMenuLink
              label="More"
              href="/menu"
              Icon={MobileMenuIcon}
              modifier="more"
            />
            <MainMenuLink
              label="Tags"
              href={routes.organisation.tags.list}
              Icon={TagsIcon}
              modifier="tags"
            />
            <MainMenuLink
              label="Settings"
              href="/settings"
              Icon={SettingsIcon}
              modifier="settings"
            />
            <MainMenuLink
              label="Help"
              href={routes.external.docs}
              Icon={HelpIcon}
              modifier="help"
              target="_blank"
            />
          </div>
        </div>
        <main className="ath-main">
          {props.children}
        </main>
      </div>
    </div>
  )
}
