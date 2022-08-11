import React, {useEffect, useState} from 'react';
import {colourPalette, IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {
  Tags as TagsIcon,
  Plus as AddNoteIcon,
  LayoutTemplate as TemplateViewIcon,
  FolderTree as FolderViewIcon,
  LayoutList as NoteListViewIcon,
  ChevronFirst as OpenVaultSectionIcon,
  ChevronLast as CloseVaultSectionIcon,
  Home as BackIcon,
  ListOrdered as HeadingIcon
} from "lucide-react";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {useAthena} from "../../helpers/use-athena";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {NoteDto, TemplateDto, VaultDto} from "@ben-ryder/athena-js-lib";
import ReactTooltip from "react-tooltip";
import {FileTabList, FileTabSection} from "../../patterns/components/file-tab/file-tab-section";
import {NoteFileTab, TemplateFileTab} from "../../patterns/components/file-tab/file-tab";
import {Editor} from "../../patterns/components/editor/editor";
import {ConnectivityIndicator} from "../../patterns/components/connectivity-indicator/connectivity-indicator";
import {ActiveContent} from "../../helpers/content-state";

const notes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const tags = [
  {
    name: "tag 1",
    value: "1"
  },
  {
    name: "tag 2",
    value: "2"
  },
  {
    name: "tag 3",
    value: "3"
  },
  {
    name: "tag 4",
    value: "4"
  },
  {
    name: "tag 5",
    value: "5"
  }
];
const selectedTags = [tags[0], tags[3], tags[4]];

const note: NoteDto = {
  id: "id",
  title: "note title",
  body: "body",
  description: null,
  createdAt: "",
  updatedAt: "",
  tags: []
}
const template: TemplateDto = {
  id: "id",
  title: "note title",
  body: "body",
  description: null,
  createdAt: "",
  updatedAt: "",
  tags: []
}


/**
 * This height is used to ensure that the logo, vault details, vault switcher and the note header all line up.
 */
const topSectionHeight = "h-[40px]";
const topSectionWidth = "w-[40px]";

type VaultSections = "folders" | "notes" | "queries" | "templates" | "tags";

export function MainPage() {
  const navigate = useNavigate();
  const {vaultId} = useParams();

  const {apiClient} = useAthena();
  const [status, setStatus] = useState<GeneralQueryStatus>(GeneralQueryStatus.LOADING);
  const [pageErrorMessage, setPageErrorMessage] = useState<string|null>(null);

  const [vault, setVault] = useState<VaultDto|null>(null);
  const [currentVaultSection, setCurrentVaultSection] = useState<VaultSections>("notes");

  const [vaultSectionIsOpen, setVaultSectionIsOpen] = useState<boolean>(true);
  const [activeContent, setActiveContent] = useState<ActiveContent>({
    type: "template",
    content: {
      id: "rrr",
      title: "te",
      description: null,
      body: "erf werg ewf iwf i wafi fwei  fi",
      createdAt: "",
      updatedAt: "",
      tags: []
    }
  });

  useEffect(() => {
    async function getVault() {
      if (!vaultId) {
        setStatus(GeneralQueryStatus.FAILED);
        return;
      }

      try {
        const vault = await apiClient.getVault(vaultId);
        setStatus(GeneralQueryStatus.SUCCESS);
        setVault(vault);
      }
      catch (e: any) {
        setStatus(GeneralQueryStatus.FAILED);

        if (e.response?.statusCode === 404) {
          setPageErrorMessage("The vault you requested does not exist.")
        }
        else if (e.response?.statusCode === 400) {
          setPageErrorMessage("You appear to be requesting a vault with an invalid ID.")
        }
        else {
          setPageErrorMessage("An unexpected error occurred while fetching the vault, try again later.");
        }
      }
    }
    getVault();
  }, [vaultId]);

  if (!vault) {
    return (
      <>
        <Helmet>
          <title>Loading Vault... | Athena</title>
        </Helmet>
        <LoadingPage
          hideHeader={true}
          status={status}
          loadingMessage="Loading vault..."
          errorMessage={pageErrorMessage || "An unepxected error occured"}
          emptyMessage="An unexpected error occurred"
        />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`${vault.name} | Athena`}</title>
      </Helmet>
      <main className="h-[100vh] w-[100vw] bg-br-atom-700 flex">

        {/** Vault Section **/}
        <section id="vault-section" className={classNames(
          "h-[100vh] flex flex-col bg-br-atom-900 z-10 transition-all",
          "w-full absolute",
          "md:w-[400px] md:relative",
          {
            'w-0 md:w-0 overflow-x-hidden opacity-0': !vaultSectionIsOpen
          }
        )}>
            {/** Vault Details **/}
            <div className={`flex justify-center items-center relative h-[40px] border-b border-br-blueGrey-700`}>
              <IconButton
                label="Back to vaults"
                data-tip="Back to vaults"
                icon={<BackIcon size={20} className={iconColorClassNames.secondary} />}
                onClick={() => {
                  navigate(routes.vaults.list)
                }}
                className="absolute left-[1rem] py-2"
              />
              <p className="text-br-whiteGrey-100 font-bold py-2">{vault.name}</p>
              <IconButton
                label="Create Note"
                data-tip="Create Note"
                icon={<AddNoteIcon size={20} className={iconColorClassNames.secondary} />}
                onClick={() => {
                  navigate(routes.vaults.list)
                }}
                className="absolute right-[1rem] py-2"
              />
            </div>

            {/** View Switcher **/}
            <div className={`flex h-[40px] border-b border-br-blueGrey-700`}>
              <IconButton
                label="Folder View"
                data-tip="Folder View"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <FolderViewIcon size={20} />
                  </div>
                }
                onClick={() => {setCurrentVaultSection("folders")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "folders",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "folders"
                  }
                )}
              />
              <IconButton
                label="List View"
                data-tip="List View"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <NoteListViewIcon size={20} />
                  </div>
                }
                onClick={() => {setCurrentVaultSection("notes")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "notes",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "notes"
                  }
                )}
              />
              {/*<IconButton*/}
              {/*  label="Query View"*/}
              {/*  data-tip="Query View"*/}
              {/*  icon={*/}
              {/*    <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>*/}
              {/*      <QueryViewIcon size={20} />*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*  onClick={() => {setCurrentVaultSection("queries")}}*/}
              {/*  className={classNames(*/}
              {/*    "grow py-2",*/}
              {/*    {*/}
              {/*      "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "queries",*/}
              {/*      "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "queries"*/}
              {/*    }*/}
              {/*  )}*/}
              {/*/>*/}
              <IconButton
                label="Templates"
                data-tip="Templates"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <TemplateViewIcon size={20} />
                  </div>
                }
                onClick={() => {setCurrentVaultSection("templates")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "templates",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "templates"
                  }
                )}
              />
              <IconButton
                label="Tags"
                data-tip="Tags"
                icon={
                  <div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                    <TagsIcon size={20} />
                    {/*<p className="ml-2 text-sm font-bold">Tags</p>*/}
                  </div>
                }
                onClick={() => {setCurrentVaultSection("tags")}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== "tags",
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === "tags"
                  }
                )}
              />
            </div>

            {/** View Content **/}
            <div className="grow overflow-y-scroll">
              {notes.map(note => (
                <div key={note}>
                  <button className="p-4 w-full text-br-whiteGrey-200 hover:bg-br-atom-600 text-left">{`test note ${note}`}</button>
                </div>
              ))}
            </div>

            {/** Vault Section Bottom Content **/}
            <div className="bg-br-atom-900 h-[40px] min-h-[40px] flex justify-between items-center px-2 border-t border-br-blueGrey-700">
              <ConnectivityIndicator status="online" />
              <IconButton
                label={vaultSectionIsOpen ? "Close Vault Section" : "Open Vault Section"}
                data-tip={vaultSectionIsOpen ? "Close Vault Section" : "Open Vault Section"}
                icon={vaultSectionIsOpen ? <OpenVaultSectionIcon /> : <CloseVaultSectionIcon />}
                className={classNames(
                  `${iconColorClassNames.secondary} h-full flex justify-center items-center`,
                  {
                    'md:hidden': !vaultSectionIsOpen
                  }
                )}
                onClick={() => {setVaultSectionIsOpen(!vaultSectionIsOpen)}}
              />
            </div>
        </section>

        {/** Note Section **/}
        <section id="note-section" className={classNames(
          "h-[100vh] flex flex-col transition-all",
          "w-[100vw]",
          "md:w-[calc(100vw-400px)]",
          {
            "md:w-full": !vaultSectionIsOpen
          }
        )}>
          <FileTabSection>
            <FileTabList>
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
              <NoteFileTab note={note} active={true}/>
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
              <NoteFileTab note={note} />
            </FileTabList>
          </FileTabSection>
          <section id="note-content" className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]">
            <Editor content={activeContent.content.body} onContentChange={(content) => {
              setActiveContent({
                type: activeContent.type,
                content: {
                  ...activeContent.content,
                  body: content
                }
              })
            }} />
          </section>

          <section className={`h-[40px] flex items-center overflow-y-hidden w-full bg-br-atom-800 px-4`}>
            <p className="text-br-whiteGrey-100"># tags go here</p>
          </section>
          <section id="bottom-panel" className={`h-[40px] bg-br-atom-800 p-2 flex items-center border-t border-br-blueGrey-700`}>
            <IconButton
              label={vaultSectionIsOpen ? "Close Vault Section" : "Open Vault Section"}
              data-tip={vaultSectionIsOpen ? "Close Vault Section" : "Open Vault Section"}
              icon={vaultSectionIsOpen ? <OpenVaultSectionIcon /> : <CloseVaultSectionIcon />}
              className={classNames(
                `${iconColorClassNames.secondary} h-full flex justify-center items-center`,
                {
                  'md:hidden': vaultSectionIsOpen
                }
              )}
              onClick={() => {setVaultSectionIsOpen(!vaultSectionIsOpen)}}
            />
            <div className="w-full flex justify-between items-center pl-2">
              <p className="text-br-whiteGrey-700 text-center italic">42 words | 526 chars</p>
              <IconButton
                label="Back to vaults"
                data-tip="Back to vaults"
                icon={<HeadingIcon size={iconSizes.small} className={iconColorClassNames.secondary} />}
                onClick={() => {}}
              />
            </div>
          </section>
        </section>
      </main>

      <ReactTooltip
        place="bottom"
        effect="solid"
        backgroundColor={colourPalette.atom["600"]}
        textColor={colourPalette.whiteGrey["100"]}
        className="shadow-md"
      />
    </>
  );
}

