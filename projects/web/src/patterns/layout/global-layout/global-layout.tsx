import React, { ReactNode, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Library as VaultIcon,
  Search as SearchIcon,
  Tag as TagsIcon,
  Settings as SettingsIcon,
  UserCircle as AccountsIcon,
  DownloadCloud as StatusDownloadIcon,
  Paperclip as AttachmentsIcon
} from "lucide-react";
import { routes } from "../../../routes";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { SmartLink } from "../../components/smart-link";
import { AttachmentsManagerPage } from "../../../pages/attachments/attachments-manager";

export function VaultPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><VaultIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Your Vaults"
      description="Switch and manage your vaults"
      content={
        <p>Switch current vault. Create, edit and delete vaults</p>
      }
    />
  )
}

export function SearchPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><SearchIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Search your content"
      description="Search for your content, view favorites and actions"
      content={
        <p>Search for your content, view favorites and actions</p>
      }
    />
  )
}

export function AttachmentsPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><AttachmentsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Manage Attachements"
      description="Manage item attachments"
      content={
        <AttachmentsManagerPage />
      }
      maxWidth="1000px"
    />
  )
}

export function TagsPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><TagsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Manage Tags"
      description="Manage tags"
      content={
        <p>View all tags. Create, edit and delete tags.</p>
      }
    />
  )
}

export function ApplicationLogsPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-status-button">
          <JIcon size="md"><StatusDownloadIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Application Logs"
      description="View application and server logs"
      content={
        <p>View app status and logs.</p>
      }
    />
  )
}

export function SettingsPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><SettingsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Settings"
      description="Manage vault and application settings"
      content={
        <p>Manage vault and application settings.</p>
      }
    />
  )
}

export function AccountsPopup() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><AccountsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Your Account"
      description="Manage your account"
      content={
        <p>Manage your account</p>
      }
    />
  )
}

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
        <div className="athena__ribbon">
          <div className="athena__ribbon-menu">
            <VaultPopup />
            <div className="sidebar-divider" />
            <SearchPopup />
            <TagsPopup />
            <AttachmentsPopup />
            <div className="sidebar-separator" />
            <ApplicationLogsPopup />
            <div className="sidebar-divider" />
            <SettingsPopup />
            <AccountsPopup />
          </div>
        </div>
        <main className="athena__main">{props.children}</main>
      </div>
    </>
  );
}
