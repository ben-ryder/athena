import React, { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import {
  Library as VaultIcon,
  Search as SearchIcon,
  PlusCircle as AddContentIcon,
  Filter as ViewsIcon,
  Tag as TagsIcon,
  Settings as SettingsIcon,
  UserCircle as AccountsIcon,
  DownloadCloud as StatusDownloadIcon, View
} from "lucide-react";
import { routes } from "../../../routes";
import { JIcon } from "@ben-ryder/jigsaw-react";
import { SmartLink } from "../../components/smart-link";

export interface GlobalLayoutProps {
  children: ReactNode;
}

export function GlobalLayout(props: GlobalLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{`Athena`}</title>
      </Helmet>

      <div className="athena">
        <div className="athena__sidebar">
          <button className="sidebar-button"><JIcon size="lg"><VaultIcon /></JIcon></button>
          <div className="sidebar-divider" />
          <SmartLink href={routes.items.list} className="sidebar-button"><JIcon size="lg"><SearchIcon /></JIcon></SmartLink>
          <SmartLink href={routes.items.create} className="sidebar-button"><JIcon size="lg"><AddContentIcon /></JIcon></SmartLink>
          <SmartLink href={routes.views.list} className="sidebar-button"><JIcon size="lg"><ViewsIcon /></JIcon></SmartLink>
          <SmartLink href={routes.tags.list} className="sidebar-button"><JIcon size="lg"><TagsIcon /></JIcon></SmartLink>
          <div className="sidebar-separator" />
          <div>
            <button className="sidebar-status-button"><JIcon size="md"><StatusDownloadIcon /></JIcon></button>
          </div>
          <div className="sidebar-divider" />
          <button className="sidebar-button"><JIcon size="lg"><SettingsIcon /></JIcon></button>
          <button className="sidebar-button"><JIcon size="lg"><AccountsIcon /></JIcon></button>
        </div>
        <main className="athena__main">{props.children}</main>
      </div>
    </>
  );
}
