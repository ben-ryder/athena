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
import {VaultDto} from "@ben-ryder/athena-js-lib";
import ReactTooltip from "react-tooltip";
import {FileTabList, FileTabSection} from "../../patterns/components/file-tab/file-tab-section";
import {ContentFileTab} from "../../patterns/components/file-tab/file-tab";
import {Editor} from "../../patterns/components/editor/editor";
import {ConnectivityIndicator} from "../../patterns/components/connectivity-indicator/connectivity-indicator";
import {Content, ContentList} from "../../helpers/content-state";
import {NotesList} from "./notes-list";
import {ContentDetails} from "../../patterns/components/content-details/content-details";


type VaultSections = "folders" | "notes" | "queries" | "templates" | "tags";


function isActiveContent(content: Content, activeContent: Content|null) {
  if (content.type === "note-new" || content.type === "template-new") {
    return false;
  }
  if (!activeContent || activeContent.type === "note-new" || activeContent.type === "template-new") {
    return false;
  }

  return content.content.id === activeContent.content.id;
}


export function MainPage() {
  const navigate = useNavigate();
  const {vaultId} = useParams();

  const {apiClient} = useAthena();
  const [status, setStatus] = useState<GeneralQueryStatus>(GeneralQueryStatus.LOADING);
  const [pageErrorMessage, setPageErrorMessage] = useState<string|null>(null);

  const [vault, setVault] = useState<VaultDto|null>(null);
  const [currentVaultSection, setCurrentVaultSection] = useState<VaultSections>("notes");

  const [changesAreSaved, setChangesAreSaved] = useState<boolean>(true);
  const [vaultSectionIsOpen, setVaultSectionIsOpen] = useState<boolean>(true);
  const [contentList, setContentList] = useState<ContentList>([]);
  const [activeContent, setActiveContent] = useState<Content|null>(null);

  async function saveActiveContent() {
    if (activeContent?.type === "note-new") {
      await apiClient.createNote(vaultId, {
        title: activeContent.content.title,
        description: activeContent.content.description,
        body: activeContent.content.body,
        tags: activeContent.content.tags.map(tag => tag.id)
      });
    }
    else if (activeContent?.type === "note-edit") {
      await apiClient.updateNote(vaultId, activeContent.content.id, {
        title: activeContent.content.title,
        description: activeContent.content.description,
        body: activeContent.content.body,
        tags: activeContent.content.tags.map(tag => tag.id)
      });
    }
    else if (activeContent?.type === "template-new") {
      await apiClient.createTemplate(vaultId, {
        title: activeContent.content.title,
        description: activeContent.content.description,
        body: activeContent.content.body,
        tags: activeContent.content.tags.map(tag => tag.id)
      });
    }
    else if (activeContent?.type === "template-edit") {
      await apiClient.updateTemplate(vaultId, activeContent.content.id, {
        title: activeContent.content.title,
        description: activeContent.content.description,
        body: activeContent.content.body,
        tags: activeContent.content.tags.map(tag => tag.id)
      });
    }

    setChangesAreSaved(true);
  }

  async function openAndSwitchContent(content: Content) {
    await saveActiveContent();

    let contentIsOpen = false;
    for (const c of contentList) {
      if (JSON.stringify(c) === JSON.stringify(content)) {
        contentIsOpen = true;
        break;
      }
    }

    if (!contentIsOpen) {
      setContentList([
        ...contentList,
        content
      ])
    }

    setActiveContent(content);
  }

  async function closeContent(content: Content) {
    await saveActiveContent();

    if (JSON.stringify(content) === JSON.stringify(activeContent)) {
      setActiveContent(null);
    }

    const newContentList = contentList.filter(c => JSON.stringify(c) !== JSON.stringify(content));
    setContentList(newContentList);
  }

  // Vault fetching
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
          errorMessage={pageErrorMessage || "An unexpected error occured"}
          emptyMessage="An unexpected error occurred"
        />
      </>
    )
  }

  let viewContent;
  if (currentVaultSection === "notes") {
    viewContent = <NotesList activeContent={activeContent} openAndSwitchContent={openAndSwitchContent} />
  }
  else {
    viewContent = <></>
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
              {viewContent}
            </div>

            {/** Vault Section Bottom Content **/}
            <div className="bg-br-atom-900 h-[40px] min-h-[40px] flex justify-between items-center px-2 border-t border-br-blueGrey-700">
              <>
                <ConnectivityIndicator status={changesAreSaved ? "online" : "offline"} />
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
              </>
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
              {contentList.map(content =>
                <ContentFileTab
                  key={content.content.title}
                  content={content}
                  active={isActiveContent(content, activeContent)}
                  openAndSwitchContent={openAndSwitchContent}
                  closeContent={closeContent}
                />
              )}
            </FileTabList>
          </FileTabSection>
          <section id="note-content" className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]">
            {activeContent &&
              <Editor
                  content={activeContent.content.body}
                  onContentChange={(content) => {
                    setChangesAreSaved(false);
                    setActiveContent({
                      // @ts-ignore
                      type: activeContent.type,
                      // @ts-ignore
                      content: {
                        ...activeContent.content,
                        body: content
                      }
                    })
                  }}
              />
            }

          </section>

          <section className={`h-[40px] flex items-center overflow-y-hidden w-full bg-br-atom-800 px-4`}>
            {activeContent &&
                <p className="text-br-whiteGrey-100"># tags go here</p>
            }
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
              {activeContent &&
                <>
                    <ContentDetails text={activeContent.content.body}/>
                    <IconButton
                        label="Back to vaults"
                        data-tip="Back to vaults"
                        icon={<HeadingIcon size={iconSizes.small} className={iconColorClassNames.secondary} />}
                        onClick={() => {}}
                    />
                </>
              }
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

