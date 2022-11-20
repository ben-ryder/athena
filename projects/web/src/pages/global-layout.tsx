import React, {cloneElement, ReactElement, useState} from 'react';
import {Helmet} from "react-helmet-async";
import classNames from "classnames";
import {IconButton, iconColorClassNames, iconSizes, StrictReactNode} from "@ben-ryder/jigsaw";
import {routes} from "../routes";
import {AccountMenu} from "../patterns/components/account-menu";
import {Link, useLocation} from "react-router-dom";
import {
  Menu as OpenMenuIcon,
  X as CloseMenuIcon,
  Github as GitHubIcon,
  File as NotesIcon,
  ListChecks as TasksIcon,
  LayoutGrid as ContentIcon,
  Plus as AddViewIcon,
  AlarmClock as RemindersIcon,
  Calendar as CalendarIcon
} from "lucide-react";

export interface ApplicationProps {
  children: StrictReactNode
}

export function GlobalLayout(props: ApplicationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

  return (
    <>
      <Helmet>
        <title>{`Application | Athena`}</title>
      </Helmet>

      {/** The main container, makes the app always fill the window **/}
      <main className="h-[100vh] w-[100vw] md:flex">

        {/** SECTION - Side Panel **/}
        <div className={classNames(
          "bg-br-atom-800 z-10 w-full absolute flex flex-col justify-between",
          "md:h-[100vh] md:w-[300px] md:relative md:border-r md:border-br-blueGrey-700"
        )}
        >

          {/** Top Menu **/}
          <div className="bg-br-atom-900 w-full h-[50px]">
            <SidebarHeader setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
          </div>

          {/** Menu Content **/}
          <div
            className={classNames(
              "flex flex-col justify-between h-[calc(100vh-50px)]",
              {
                "hidden md:flex": !isMenuOpen
              }
            )}
          >
            <ContentMenu />

            {/** Account Menu **/}
            <div className="bg-br-atom-900 w-full h-[50px]">
              <AccountMenu />
            </div>
          </div>
        </div>

        {/** SECTION - Main Area **/}
        <div className="bg-br-atom-700 w-[100vw] h-[100vh] md:w-[calc(100vw-300px)] pt-[50px] md:pt-0">
          {props.children}
        </div>
      </main>
    </>
  )
}


export interface ContentMenuLinkProps {
  icon: ReactElement,
  link: string,
  label: string
}
export function ContentMenuLink(props: ContentMenuLinkProps) {
  const {pathname} = useLocation();

  // Specially handle the root path as it should only be active when matched exactly.
  const isActive = (props.link === "/" && pathname === "/") || (props.link !== "/" && pathname.startsWith(props.link));

  const icon = cloneElement(props.icon, {
    className: "mr-3 text-br-teal-600 ",
    size: iconSizes.small
  });

  const className = classNames(
    "flex items-center text-br-whiteGrey-100 py-2 px-4 hover:bg-br-atom-600",
    {
      "bg-br-atom-700  font-bold": isActive
    }
  );

  if (props.link.startsWith("http")) {
    return (
      <a
        href={props.link}
        className={className}
        target="_blank"
      >
        {icon}
        {props.label}
      </a>
    )
  }

  return (
    <Link
      to={props.link}
      className={className}
    >
      {icon}
      {props.label}
    </Link>
  )
}

export function ContentMenu() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="font-bold border-b-2 border-br-blueGrey-700 py-1 text-br-whiteGrey-100">Content</h2>
        <div className="mt-1">
          <ContentMenuLink icon={<ContentIcon />} link={routes.home} label="All" />
          <ContentMenuLink icon={<NotesIcon />} link={routes.content.notes.list} label="Notes" />
          <ContentMenuLink icon={<TasksIcon />} link={routes.content.tasks.list} label="Task Lists" />
          <ContentMenuLink icon={<RemindersIcon />} link={routes.content.reminders.list} label="Reminders" />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between border-b-2 border-br-blueGrey-700">
          <h2 className="font-bold text-br-whiteGrey-100 py-1">Views</h2>
          <Link to={routes.content.views.create} aria-label="Add New View">
            <AddViewIcon className={iconColorClassNames.secondary} size={iconSizes.small} />
          </Link>
        </div>
        <div className="mt-1">
          <p className="text-br-red-500">views go here...</p>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="font-bold border-b-2 border-br-blueGrey-700 py-1 text-br-whiteGrey-100">Templates</h2>
        <div className="mt-1">
          <ContentMenuLink icon={<NotesIcon />} link={routes.templates.notes.list} label="Note Templates" />
          <ContentMenuLink icon={<TasksIcon />} link={routes.templates.tasks.list} label="Task List Templates" />
        </div>
      </div>
      <div className="mb-6">
        <h2 className="font-bold text-br-whiteGrey-100 border-b-2 border-br-blueGrey-700 py-1">Links</h2>
        <div className="mt-1">
          <ContentMenuLink icon={<GitHubIcon />} link={routes.external.github} label="GitHub" />
        </div>
      </div>
    </div>
  )
}

export interface SidebarHeaderProps {
  isMenuOpen: boolean,
  setIsMenuOpen: (isOpen: boolean) => void
}

export function SidebarHeader(props: SidebarHeaderProps) {
  return (
    <div className="flex justify-between items-center h-full px-2">
      <Link to={routes.home} className="flex items-center">
        <i className="block w-7 h-7 rounded-full bg-br-teal-600"></i>
        <p className="ml-2 font-bold text-br-whiteGrey-100">Athena</p>
      </Link>

      {props.isMenuOpen
        ? <IconButton
            className="md:hidden"
            icon={<CloseMenuIcon className={iconColorClassNames.secondary} size={iconSizes.medium} />}
            label="Close Menu"
            onClick={() => {props.setIsMenuOpen(false)}}
        />
        : <IconButton
            className="md:hidden"
            icon={<OpenMenuIcon className={iconColorClassNames.secondary} size={iconSizes.medium} />}
            label="Open Menu"
            onClick={() => {props.setIsMenuOpen(true)}}
        />
      }
    </div>
  )
}
