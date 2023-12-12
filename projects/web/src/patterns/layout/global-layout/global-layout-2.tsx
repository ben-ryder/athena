import React, { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText as NotesIcon,
  ListChecks as TasksIcon,
  MoreHorizontal as MobileMenuIcon,
  Tag as TagsIcon,
  Settings as SettingsIcon,
  Triangle as LogoIcon,
  LucideIcon,
  HelpCircle as HelpIcon,
  UserCircle as AccountsIcon,
} from "lucide-react";
import { routes } from "../../../routes";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import classNames from "classnames";

export interface GlobalLayoutProps {
  children: ReactNode;
}

export interface MainMenuLinkProps {
  Icon: LucideIcon;
  label: string;
  href: string;
  modifier?: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
}
export function MainMenuLink(props: MainMenuLinkProps) {
  let resolved = useResolvedPath(props.href);
  let match = useMatch({ path: resolved.pathname, end: false });

  const className = classNames(
    "ath-menu-bar__menu-link",
    props.modifier ? `ath-menu-bar__menu-link--${props.modifier}` : "",
    {
      "ath-menu-bar__menu-link--active": match,
    },
  );

  return (
    <Link to={props.href} className={className} target={props.target}>
      <props.Icon />
      <span>{props.label}</span>
    </Link>
  );
}

export function GlobalLayout2(props: GlobalLayoutProps) {
  return (
    <div className="ath-root">
      <Helmet>
        <title>{`Athena`}</title>
      </Helmet>

      <div className="ath-layout">
        <div className="ath-menu-bar">
          <div className="ath-menu-bar__menu">
            <MainMenuLink
              label="Notes"
              href={routes.notes.list}
              Icon={NotesIcon}
              modifier="notes"
            />
            <MainMenuLink
              label="Tasks"
              href={routes.tasks.list}
              Icon={TasksIcon}
              modifier="tasks"
            />

            <MainMenuLink
              label="More"
              href="/menu"
              Icon={MobileMenuIcon}
              modifier="more"
            />

            <MainMenuLink
              label="Tags"
              href={routes.tags.list}
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
              Icon={AccountsIcon}
              modifier="help"
              target="_blank"
            />
          </div>
        </div>
        <main className="ath-main">{props.children}</main>
      </div>
    </div>
  );
}
