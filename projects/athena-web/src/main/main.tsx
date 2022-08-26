import React, {useState} from 'react';
import {colourPalette, IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {
  ChevronFirst as OpenVaultSectionIcon,
  ChevronLast as CloseVaultSectionIcon,
  FolderTree as FolderViewIcon,
  Home as BackIcon,
  LayoutList as NoteListViewIcon,
  LayoutTemplate as TemplateViewIcon,
  ListOrdered as HeadingIcon,
  Plus as AddNoteIcon,
  Tags as TagsIcon
} from "lucide-react";
import classNames from "classnames";
import {Helmet} from "react-helmet-async";
import {NoteDto, TemplateDto} from "@ben-ryder/athena-js-lib";
import ReactTooltip from "react-tooltip";
import {FileTabList, FileTabSection} from "../patterns/components/file-tab/file-tab-section";
import {ContentFileTab} from "../patterns/components/file-tab/file-tab";
import {Editor} from "../patterns/components/editor/editor";
import {
  SavedStatus,
  SavedStatusIndicator
} from "../patterns/components/saved-status-indicator/saved-status-indicator";
import {Content, ContentList, ContentType} from "../helpers/content-state";
import {NotesList} from "../patterns/components/notes-list";
import {ContentDetails} from "../patterns/components/content-details/content-details";
import {v4 as createUUID} from "uuid";
import {Provider} from "react-redux";
import store from "./state/store";

enum VaultSections {
  FOLDERS,
  NOTES,
  QUERIES,
  TEMPLATES,
  TAGS
}

function isActiveContent(content: Content, openContentList: ContentList, activeContentIndex: number|null) {
  const activeContent = activeContentIndex !== null ? openContentList[activeContentIndex] : null;

  if (!activeContent) {
    return false;
  }
  return content === activeContent;
}

export function MainPage() {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  )
}

export function Application() {
  // Interface and Interaction State
  const [currentVaultSection, setCurrentVaultSection] = useState<VaultSections>(VaultSections.NOTES);
  const [savedStatus, setSavedStatus] = useState<SavedStatus>(SavedStatus.SAVED);
  const [vaultPanelIsOpen, setVaultPanelIsOpen] = useState<boolean>(true);

  // Editor State
  const [openContentList, setOpenContentList] = useState<ContentList>([]);
  const [activeContentIndex, setActiveContentIndex] = useState<number|null>(null);

  // Content State
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [templates, setTemplates] = useState<TemplateDto[]>([]);

  async function saveActiveContent() {
    if (activeContentIndex === null) {
      return;
    }
    setSavedStatus(SavedStatus.SAVED);
  }

  async function switchActiveContent(contentId: number) {
    await saveActiveContent();
    setActiveContentIndex(contentId);
  }

  async function openContent(contentToOpen: Content) {
    // Switch to content if it's already open
    for (let i = 0; i < openContentList.length; i++) {
      const content = openContentList[i];
      if (JSON.stringify(content) === JSON.stringify(contentToOpen)) {
        return setActiveContentIndex(i);
      }
    }

    setOpenContentList([
      ...openContentList,
      contentToOpen
    ]);
    setActiveContentIndex(openContentList.length);
  }

  async function closeContent(contentId: number) {
    await saveActiveContent();

    const newOpenContentList = openContentList.filter((content, index) => index !== contentId);
    setOpenContentList(newOpenContentList);

    if (activeContentIndex === null) {
      return;
    }
    else if (contentId === activeContentIndex) {
      setActiveContentIndex(null);
    }
    else if (activeContentIndex >= contentId) {
      const updatedActiveContentIndex = Math.max(activeContentIndex - 1, 0);
      setActiveContentIndex(updatedActiveContentIndex);
    }
  }

  async function createNote() {
    const newNote: NoteDto = {
      id: createUUID(),
      title: "untitled",
      description: null,
      body: "",
      createdAt: "",
      updatedAt: "",
      tags: []
    }

    setNotes([
      ...notes,
      newNote
    ])
    setOpenContentList([
      ...openContentList,
      {
        type: ContentType.NOTE_EDIT,
        content: newNote
      }
    ])
  }

  async function createTemplate() {
    const newTemplate: TemplateDto = {
      id: createUUID(),
      title: "untitled",
      description: null,
      body: "",
      createdAt: "",
      updatedAt: "",
      tags: []
    }

    setTemplates([
      ...templates,
      newTemplate
    ])
    setOpenContentList([
      ...openContentList,
      {
        type: ContentType.TEMPLATE_EDIT,
        content: newTemplate
      }
    ])
  }

  let viewContent;
  if (currentVaultSection === VaultSections.NOTES) {
    viewContent = <NotesList
      notes={notes}
      setNotes={setNotes}
      activeContent={activeContentIndex !== null ? openContentList[activeContentIndex] : null}
      openContent={openContent}
    />
  }
  else {
    viewContent = <></>
  }

  return (
    <>
      <Helmet>
        <title>{`Vault Name | Athena`}</title>
      </Helmet>
      <main className="h-[100vh] w-[100vw] bg-br-atom-700 flex">

        {/** Vault Section **/}
        <section id="vault-section" className={classNames(
          "h-[100vh] flex flex-col bg-br-atom-900 z-10 transition-all",
          "w-full absolute",
          "md:w-[400px] md:relative",
          {
            'w-0 md:w-0 overflow-x-hidden opacity-0': !vaultPanelIsOpen
          }
        )}>
            {/** Vault Details **/}
            <div className={`flex justify-center items-center relative h-[40px] border-b border-br-blueGrey-700`}>
              <IconButton
                label="Back to vaults"
                data-tip="Back to vaults"
                icon={<BackIcon size={20} className={iconColorClassNames.secondary} />}
                onClick={() => {}}
                className="absolute left-[1rem] py-2"
              />
              <p className="text-br-whiteGrey-100 font-bold py-2">Vault Name</p>
              <IconButton
                label={currentVaultSection === VaultSections.TEMPLATES ?  "Create Template" : "Create Note"}
                data-tip={currentVaultSection === VaultSections.TEMPLATES ?  "Create Template" : "Create Note"}
                icon={<AddNoteIcon size={20} className={iconColorClassNames.secondary} />}
                onClick={() => {
                  if (currentVaultSection === VaultSections.TEMPLATES) {
                    createTemplate()
                  }
                  else {
                    createNote();
                  }
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
                onClick={() => {setCurrentVaultSection(VaultSections.FOLDERS)}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== VaultSections.FOLDERS,
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === VaultSections.FOLDERS
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
                onClick={() => {setCurrentVaultSection(VaultSections.NOTES)}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== VaultSections.NOTES,
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === VaultSections.NOTES
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
                onClick={() => {setCurrentVaultSection(VaultSections.TEMPLATES)}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== VaultSections.TEMPLATES,
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === VaultSections.TEMPLATES
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
                onClick={() => {setCurrentVaultSection(VaultSections.TAGS)}}
                className={classNames(
                  "grow py-2",
                  {
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentVaultSection !== VaultSections.TAGS,
                    "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentVaultSection === VaultSections.TAGS
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
                <SavedStatusIndicator status={savedStatus}  />
                <IconButton
                  label={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
                  data-tip={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
                  icon={vaultPanelIsOpen ? <OpenVaultSectionIcon /> : <CloseVaultSectionIcon />}
                  className={classNames(
                    `${iconColorClassNames.secondary} h-full flex justify-center items-center`,
                    {
                      'md:hidden': !vaultPanelIsOpen
                    }
                  )}
                  onClick={() => {setVaultPanelIsOpen(!vaultPanelIsOpen)}}
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
            "md:w-full": !vaultPanelIsOpen
          }
        )}>
          <FileTabSection>
            <FileTabList>
              {openContentList.map((content, index) =>
                <ContentFileTab
                  key={content.content.title}
                  content={content}
                  active={isActiveContent(content, openContentList, activeContentIndex)}
                  switchToContent={() => {switchActiveContent(index)}}
                  closeContent={() => {closeContent(index)}}
                />
              )}
            </FileTabList>
          </FileTabSection>
          <section id="note-content" className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]">
            {activeContentIndex !== null &&
              <Editor
                  value={openContentList[activeContentIndex].content.body}
                  onChange={(updatedValue) => {
                    setSavedStatus(SavedStatus.UNSAVED);

                    const updatedOpenContentList = openContentList.map((content, index) => {
                      if (index !== activeContentIndex) {
                        return content;
                      }
                      return {
                        type: openContentList[activeContentIndex].type,
                        content: {
                          ...openContentList[activeContentIndex].content,
                          body: updatedValue
                        }

                      }
                    })

                    // todo: fix types not quite working
                    // @ts-ignore
                    setOpenContentList(updatedOpenContentList);
                  }}
              />
            }

          </section>

          <section className={`h-[40px] flex items-center overflow-y-hidden w-full bg-br-atom-800 px-4`}>
            {activeContentIndex !== null &&
                <p className="text-br-whiteGrey-100"># tags go here</p>
            }
          </section>
          <section id="bottom-panel" className={`h-[40px] bg-br-atom-800 p-2 flex items-center border-t border-br-blueGrey-700`}>
            <IconButton
              label={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
              data-tip={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
              icon={vaultPanelIsOpen ? <OpenVaultSectionIcon /> : <CloseVaultSectionIcon />}
              className={classNames(
                `${iconColorClassNames.secondary} h-full flex justify-center items-center`,
                {
                  'md:hidden': vaultPanelIsOpen
                }
              )}
              onClick={() => {setVaultPanelIsOpen(!vaultPanelIsOpen)}}
            />
            <div className="w-full flex justify-between items-center pl-2">
              {activeContentIndex !== null &&
                <>
                    <ContentDetails text={openContentList[activeContentIndex].content.body}/>
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

