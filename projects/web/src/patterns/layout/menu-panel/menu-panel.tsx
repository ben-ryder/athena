
import {
  PenLine as EditIcon,
  ArrowRightLeft as DatabaseSwitchIcon,
  CloudDownload as StatusDownloadIcon,
  PlusSquare as NewContentIcon,
  Search as SearchIcon,
  List as AllContentIcon,
  Filter as AllViewsIcon,
  Shapes as DataStructureIcon,
  UserCircle as AccountIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpIcon,
} from "lucide-react"
import {MainPanelAction} from "./main-panel-action";

import './menu-panel.scss'
import {JIcon} from "@ben-ryder/jigsaw-react";
import {useDatabaseDialog} from "../../../features/databases/database-dialog";
import {useNewContentDialog} from "../../../features/new-content/new-content-dialog";
import {useStatusDialog} from "../../../features/status/status-dialog";
import {useSearchDialog} from "../../../features/search/dialog/search-dialog";
import {useDataStructureDialog} from "../../../features/data-structure/data-structure-dialog";
import { useViewsDialog } from "../../../features/views/dialog/views-dialog";
import {useContentListDialog} from "../../../features/content-list/dialog/content-list-dialog";
import {useSettingsDialog} from "../../../features/settings/settings-dialog";

export interface WithMenuPanelControl {
  menuPanelIsOpen: boolean
  setMenuPanelIsOpen: (isOpen: boolean) => void
}

export function MenuPanel() {
  const {setIsOpen: setDatabaseDialogOpen } = useDatabaseDialog()
  const {setIsOpen: setNewContentDialogOpen } = useNewContentDialog()
  const {setIsOpen: setStatusDialogOpen } = useStatusDialog()
  const {setIsOpen: setSearchDialogOpen } = useSearchDialog()
  const {setIsOpen: setDataStructureDialogOpen } = useDataStructureDialog()
  const {setIsOpen: setViewsDialogOpen } = useViewsDialog()
  const {setIsOpen: setContentListDialogOpen } = useContentListDialog()
    const {setIsOpen: setSettingsDialogOpen } = useSettingsDialog()

  return (
      <div className="menu-panel">
        <div className="menu-panel__database">
          <div className="menu-panel__database-content">
            <button
                className="menu-panel__database-edit"
                onClick={() => {
                  setDatabaseDialogOpen(true)
                }}
            >
              <span className="menu-panel__database-name" tabIndex={-1}>Example Database</span>
              <JIcon size='sm'><EditIcon/></JIcon>
            </button>
            <button
                className="menu-panel__database-status"
                onClick={() => {
                  setStatusDialogOpen(true)
                }}
            ><JIcon><StatusDownloadIcon/></JIcon></button>
            <button className="menu-panel__database-switch"><JIcon><DatabaseSwitchIcon/></JIcon></button>
          </div>
        </div>

        <div className="menu-panel__actions">
          <MainPanelAction
              text='New Content'
              icon={<NewContentIcon/>}
              onSelect={() => {
                setNewContentDialogOpen(true)
              }}
              isSpecial={true}
          />
          <MainPanelAction
              text='Search'
              icon={<SearchIcon/>}
              onSelect={() => {
                setSearchDialogOpen(true)
              }}
          />
          <MainPanelAction
              text='All Content'
              icon={<AllContentIcon/>}
              onSelect={() => {
                  setContentListDialogOpen(true)
              }}
          />
          <MainPanelAction
              text='All Views'
              icon={<AllViewsIcon/>}
              onSelect={() => {
                setViewsDialogOpen(true)
              }}
          />
          <MainPanelAction
              text='Data Structure'
              icon={<DataStructureIcon/>}
              onSelect={() => {
                setDataStructureDialogOpen(true)
              }}
          />
        </div>

        <div className="menu-panel__favorites">
          <div className="menu-panel__favorites-header">
            <h3>Favorite Views</h3>
          </div>
          <div>
            No Favorites Found
          </div>
        </div>

        <div className="menu-panel__favorites">
          <div className="menu-panel__favorites-header">
            <h3>Favorite Content</h3>
          </div>
          <div>
            No Favorites Found
          </div>
        </div>

        <div className="menu-panel__user">
          <div className="menu-panel__user-content">
            {/*<button*/}
            {/*    className="menu-panel__user-account"*/}
            {/*><AccountIcon/></button>*/}
            <button
                className="menu-panel__user-settings"
                onClick={() => {
                    setSettingsDialogOpen(true)
                }}
            ><SettingsIcon/></button>
            <button
                className="menu-panel__user-help"
            ><HelpIcon/></button>
          </div>
        </div>
      </div>
  )
}