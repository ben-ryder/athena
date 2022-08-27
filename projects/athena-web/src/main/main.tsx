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
import ReactTooltip from "react-tooltip";
import {FileTabList, FileTabSection} from "../patterns/components/file-tab/file-tab-section";
import {ContentFileTab} from "../patterns/components/file-tab/file-tab";
import {Editor} from "../patterns/components/editor/editor";
import {SavedStatus, SavedStatusIndicator} from "../patterns/components/saved-status-indicator/saved-status-indicator";
import {NotesList} from "../patterns/components/notes-list";
import {ContentDetails} from "../patterns/components/content-details/content-details";
import {Provider, useSelector} from "react-redux";
import {store, useAppDispatch} from "./state/store";
import {createNote, updateNoteBody} from "./state/features/open-vault/notes/notes-actions";
import {v4 as createUUID} from "uuid";
import {selectActiveContent, selectOpenContent} from "./state/features/ui/ui-selctors";
import {ContentType} from "./state/features/ui/ui-interfaces";

enum PanelSections {
  FOLDERS = "FOLDERS",
  NOTES = "NOTES",
  QUERIES = "QUERIES",
  TEMPLATES = "TEMPLATES",
  TAGS = "TAGS"
}

export function MainPage() {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  )
}

export function Application() {
  const dispatch = useAppDispatch();
  const openContent = useSelector(selectOpenContent);
  const activeContent = useSelector(selectActiveContent);

  // Interface State
  const [currentPanelSection, setCurrentPanelSection] = useState<PanelSections>(PanelSections.NOTES);
  const [savedStatus, setSavedStatus] = useState<SavedStatus>(SavedStatus.SAVED);
  const [vaultPanelIsOpen, setVaultPanelIsOpen] = useState<boolean>(true);
  
  let viewContent;
  if (currentPanelSection === PanelSections.NOTES) {
    viewContent = <NotesList />
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
              icon={<BackIcon size={20} className={iconColorClassNames.secondary}/>}
              onClick={() => {
              }}
              className="absolute left-[1rem] py-2"/>
            <p className="text-br-whiteGrey-100 font-bold py-2">Vault Name</p>
            <IconButton
              label={currentPanelSection === PanelSections.TEMPLATES ? "Create Template" : "Create Note"}
              data-tip={currentPanelSection === PanelSections.TEMPLATES ? "Create Template" : "Create Note"}
              icon={<AddNoteIcon size={20} className={iconColorClassNames.secondary}/>}
              onClick={async () => {
                dispatch(createNote({
                  id: createUUID(),
                  uuid: createUUID(),
                  name: "untitled",
                  body: "",
                  folderId: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }));
              }}
              className="absolute right-[1rem] py-2"/>
          </div>

          {/** View Switcher **/}
          <div className={`flex h-[40px] border-b border-br-blueGrey-700`}>
            <IconButton
              label="Folder View"
              data-tip="Folder View"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <FolderViewIcon size={20}/>
              </div>}
              onClick={() => {
                setCurrentPanelSection(PanelSections.FOLDERS);
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentPanelSection !== PanelSections.FOLDERS,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentPanelSection === PanelSections.FOLDERS
                }
              )}/>
            <IconButton
              label="List View"
              data-tip="List View"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <NoteListViewIcon size={20}/>
              </div>}
              onClick={() => {
                setCurrentPanelSection(PanelSections.NOTES);
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentPanelSection !== PanelSections.NOTES,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentPanelSection === PanelSections.NOTES
                }
              )}/>
            <IconButton
              label="Templates"
              data-tip="Templates"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <TemplateViewIcon size={20}/>
              </div>}
              onClick={() => {
                setCurrentPanelSection(PanelSections.TEMPLATES);
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentPanelSection !== PanelSections.TEMPLATES,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentPanelSection === PanelSections.TEMPLATES
                }
              )}/>
            <IconButton
              label="Tags"
              data-tip="Tags"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <TagsIcon size={20}/>
              </div>}
              onClick={() => {
                setCurrentPanelSection(PanelSections.TAGS);
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentPanelSection !== PanelSections.TAGS,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentPanelSection === PanelSections.TAGS
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
            <SavedStatusIndicator status={savedStatus}/>
            <IconButton
              label={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
              data-tip={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
              icon={vaultPanelIsOpen ? <OpenVaultSectionIcon/> : <CloseVaultSectionIcon/>}
              className={classNames(
                `${iconColorClassNames.secondary} h-full flex justify-center items-center`,
                {
                  'md:hidden': !vaultPanelIsOpen
                }
              )}
              onClick={() => {
                setVaultPanelIsOpen(!vaultPanelIsOpen);
              }}
            />
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
              {openContent.map((content, index) =>
                <ContentFileTab
                  key={content.data.id}
                  content={content}
                  active={activeContent !== null && activeContent.data.id === content.data.id}
                  switchToContent={() => {}}
                  closeContent={() => {}}
                />
              )}
            </FileTabList>
          </FileTabSection>
          <section id="note-content" className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]">
            {(activeContent !== null && activeContent.type !== ContentType.TASK_LIST) &&
                <Editor
                    value={activeContent.data.body}
                    onChange={(updatedBody) => {
                      if (activeContent?.type === ContentType.NOTE) {
                        dispatch(updateNoteBody({
                          id: activeContent.data.id,
                          body: updatedBody
                        }));
                      }
                    }}
                />
            }
          </section>

          <section className={`h-[40px] flex items-center overflow-y-hidden w-full bg-br-atom-800 px-4`}>
            {activeContent !== null &&
                <p className="text-br-whiteGrey-100"># tags go here</p>
            }
          </section>
          <section id="bottom-panel" className={`h-[40px] bg-br-atom-800 p-2 flex items-center border-t border-br-blueGrey-700`}>
            <IconButton
              label={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
              data-tip={vaultPanelIsOpen ? "Close Vault Section" : "Open Vault Section"}
              icon={vaultPanelIsOpen ? <OpenVaultSectionIcon/> : <CloseVaultSectionIcon/>}
              className={classNames(
                `${iconColorClassNames.secondary} h-full flex justify-center items-center`,
                {
                  'md:hidden': vaultPanelIsOpen
                }
              )}
              onClick={() => {
                setVaultPanelIsOpen(!vaultPanelIsOpen);
              }}/>
            <div className="w-full flex justify-between items-center pl-2">
              {(activeContent !== null && activeContent.type !== ContentType.TASK_LIST) &&
                  <ContentDetails text={activeContent.data.body} />
              }
              <IconButton
                  label="Table of Contents"
                  data-tip="Table of Contents"
                  icon={<HeadingIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
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
  )
}

