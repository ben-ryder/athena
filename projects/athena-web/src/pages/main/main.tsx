import React, {useState} from 'react';
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {
  User as AccountIcon,
  StickyNote as NotesIcon,
  Tag as TagsIcon,
  Filter as QueriesIcon,
  ArrowLeft as BackIcon
} from "lucide-react";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";

/**
 * This height is used to ensure that the logo, vault details, vault switcher and the note header all line up.
 */
const topSectionHeight = "h-[45px]";

type VaultSections = "notes" | "queries" | "tags";

export function MainPage() {
  const navigate = useNavigate();
  const [currentVaultSection, setCurrentVaultSection] = useState<VaultSections>("notes");

  return (
    <>
      <Helmet>
        <title>{`Vault Name Here | Athena`}</title>
      </Helmet>
      <div className="min-h-[100vh] bg-br-atom-700 flex">

        {/** Left Panel (Account Menu & Vault Panel) **/}
        <div id="left-panel" className="min-h-[100vh] flex">

          {/** Vault Panel **/}
          <section className="flex flex-col w-[500px] bg-br-atom-800">

            {/** Vault Details **/}
            <div className={`flex justify-center items-center relative ${topSectionHeight} border-b-2 border-br-blueGrey-700`}>
              <IconButton
                label="Back to vaults"
                icon={<BackIcon size={20} className={iconColorClassNames.secondary} />}
                onClick={() => {
                  navigate(routes.vaults.list)
                }}
                className="absolute left-[0.5rem] py-2"
              />
              <p className="text-br-whiteGrey-100 font-bold py-2">Vault Name Here</p>
              <IconButton
                label="Account Menu"
                icon={
                  <div className={iconColorClassNames.secondary + " flex items-center border-2 border-br-whiteGrey-100 hover:border-br-whiteGrey-200 rounded-[50%]"}>
                    <AccountIcon size={20} className={iconColorClassNames.secondary} />
                  </div>
                }
                onClick={() => {}}
                className="absolute right-[0.5rem] py-2"
              />
            </div>

            {/** Vault Panel Switcher **/}
            <div className={`flex ${topSectionHeight} border-b-2 border-br-blueGrey-700`}>
              <IconButton
                label="Notes"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <NotesIcon size={20} />
                    <p className="ml-2 text-sm font-bold">Notes</p>
                  </div>
                }
                onClick={() => {setCurrentVaultSection("notes")}}
                className={classNames(
                  "w-[33%] py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "notes",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "notes"
                  }
                )}
              />
              <IconButton
                label="Queries"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <QueriesIcon size={20} />
                    <p className="ml-2 text-sm font-bold">Queries</p>
                  </div>
                }
                onClick={() => {setCurrentVaultSection("queries")}}
                className={classNames(
                  "w-[33%] py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "queries",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "queries"
                  }
                )}
              />
              <IconButton
                label="Tags"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <TagsIcon size={20} />
                    <p className="ml-2 text-sm font-bold">Tags</p>
                  </div>
                }
                onClick={() => {setCurrentVaultSection("tags")}}
                className={classNames(
                  "w-[33%] py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "tags",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "tags"
                  }
                )}
              />
            </div>

            {/** Vault Panel Content **/}
            <div className="">
            </div>
          </section>
        </div>

        <div id="main-panel w-full">
          <section id="note-panel">

          </section>
          <section id="bottom-panel">

          </section>
        </div>

        {/** Main Section **/}

      </div>
    </>
  );
}

