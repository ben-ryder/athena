import React, {useState} from 'react';
import {colourPalette, IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {
  ArrowLeftRight as VaultIcon,
  ChevronFirst as OpenVaultSectionIcon,
  ChevronLast as CloseVaultSectionIcon,
  FolderTree as FolderViewIcon,
  LayoutList as NoteListViewIcon,
  ListOrdered as HeadingIcon,
  Tags as TagsIcon,
  Filter as QueryIcon
} from "lucide-react";
import classNames from "classnames";
import {Helmet} from "react-helmet-async";
import ReactTooltip from "react-tooltip";
import {FileTabList, FileTabSection} from "../patterns/components/file-tab/file-tab-section";
import {ContentFileTab} from "../patterns/components/file-tab/file-tab";
import {Editor} from "../patterns/components/editor/editor";
import {SavedStatus, SavedStatusIndicator} from "../patterns/components/saved-status-indicator/saved-status-indicator";
import {ContentDetails} from "../patterns/components/content-details/content-details";
import {Provider, useSelector} from "react-redux";
import {persistor, store, useAppDispatch} from "./state/store";
import {createNote, updateNoteBody} from "./state/features/open-vault/notes/notes-actions";
import {selectActiveContent, selectOpenContent} from "./state/features/ui/content/content-selctors";
import {ContentType} from "./state/features/ui/content/content-interface";
import {AccountIcon} from "../patterns/element/account-icon";
import {updateTemplateBody} from "./state/features/open-vault/templates/templates-actions";
import {selectCurrentViewMode} from "./state/features/ui/view/view-selectors";
import {ViewModes} from "./state/features/ui/view/view-interface";
import {switchCurrentViewMode} from "./state/features/ui/view/view-actions";
import {ListView} from "../patterns/components/list-view";
import {PersistGate} from "redux-persist/integration/react";
import {CreateContentIconAndPopup} from "../patterns/components/popup-menus/create-content-menu";
import {RenameModal} from "../patterns/components/modals/rename-modal";
import {DeleteModal} from "../patterns/components/modals/delete-modal";
import {CreateModal} from "../patterns/components/modals/create-modal";


export function MainPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Application />
      </PersistGate>
    </Provider>
  )
}

export function Application() {
  const dispatch = useAppDispatch();
  const openContent = useSelector(selectOpenContent);
  const activeContent = useSelector(selectActiveContent);
  const currentViewMode = useSelector(selectCurrentViewMode);

  // Interface State
  const [savedStatus, setSavedStatus] = useState<SavedStatus>(SavedStatus.SAVED);
  const [vaultPanelIsOpen, setVaultPanelIsOpen] = useState<boolean>(true);
  
  let viewContent;
  if (currentViewMode === ViewModes.LIST_VIEW) {
    viewContent = <ListView />
  }
  else if (currentViewMode === ViewModes.FOLDER_VIEW) {
    viewContent = <p>Folder Tree</p>
  }
  else {
    viewContent = <p>Tags</p>
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
              label="Open Vault Menu"
              data-tip="Open Vault Menu"
              icon={<VaultIcon size={20} className={iconColorClassNames.secondary}/>}
              onClick={() => {}}
              className="absolute left-[10px] py-2"
            />
            <p className="text-br-whiteGrey-100 font-bold py-2">Vault Name</p>
            <div className="absolute right-[10px] flex">
              <CreateContentIconAndPopup />
            </div>
          </div>

          {/** View Switcher **/}
          <div className={`flex h-[40px] min-h-[40px] border-b border-br-blueGrey-700`}>
            <IconButton
              label="Folder View"
              data-tip="Folder View"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <FolderViewIcon size={20}/>
              </div>}
              onClick={() => {
                dispatch(switchCurrentViewMode(ViewModes.FOLDER_VIEW));
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentViewMode !== ViewModes.FOLDER_VIEW,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentViewMode === ViewModes.FOLDER_VIEW
                }
              )}
            />
            <IconButton
              label="Query View"
              data-tip="Query View"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <QueryIcon size={20}/>
              </div>}
              onClick={() => {
                dispatch(switchCurrentViewMode(ViewModes.QUERY_VIEW));
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentViewMode !== ViewModes.QUERY_VIEW,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentViewMode === ViewModes.QUERY_VIEW
                }
              )}
            />
            <IconButton
              label="List View"
              data-tip="List View"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <NoteListViewIcon size={20}/>
              </div>}
              onClick={() => {
                dispatch(switchCurrentViewMode(ViewModes.LIST_VIEW));
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentViewMode !== ViewModes.LIST_VIEW,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentViewMode === ViewModes.LIST_VIEW
                }
              )}
            />
            <IconButton
              label="Tags"
              data-tip="Tags"
              icon={<div className={iconColorClassNames.secondary + " flex justify-center items-center"}>
                <TagsIcon size={20}/>
              </div>}
              onClick={() => {
                dispatch(switchCurrentViewMode(ViewModes.TAGS_VIEW));
              }}
              className={classNames(
                "grow py-2",
                {
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200": currentViewMode !== ViewModes.TAGS_VIEW,
                  "stroke-br-whiteGrey-100 text-br-whiteGrey-200 bg-br-teal-600": currentViewMode === ViewModes.TAGS_VIEW
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
            <IconButton
              label="Open Account Menu"
              data-tip="Open Account Menu"
              icon={<AccountIcon />}
              onClick={() => {}}

            />
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
                      else if (activeContent.type === ContentType.TEMPLATE) {
                        dispatch(updateTemplateBody({
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
              {activeContent !== null &&
                  <ContentDetails content={activeContent} />
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

      <CreateModal />
      <RenameModal />
      <DeleteModal />

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

