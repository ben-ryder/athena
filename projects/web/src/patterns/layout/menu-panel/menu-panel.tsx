
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
import {useSearchDialog} from "../../../features/search/search-dialog";
import {useDataStructureDialog} from "../../../features/data-structure/data-structure-dialog";

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

  return (
    <div className="menu-panel">
      <div className="menu-panel__database">
        <div className="menu-panel__database-content">
          <button
            className="menu-panel__database-edit"
            onClick={() => {setDatabaseDialogOpen(true)}}
          >
            <span className="menu-panel__database-name" tabIndex={-1}>Example Database</span>
            <JIcon size='sm'><EditIcon/></JIcon>
          </button>
          <button
            className="menu-panel__database-status"
            onClick={() => {setStatusDialogOpen(true)}}
          ><JIcon><StatusDownloadIcon/></JIcon></button>
          <button className="menu-panel__database-switch"><JIcon><DatabaseSwitchIcon/></JIcon></button>
        </div>
      </div>

      <div className="menu-panel__actions">
        <MainPanelAction
          text='New Content'
          icon={<NewContentIcon />}
          onSelect={() => {
            setNewContentDialogOpen(true)
          }}
        />
        <MainPanelAction
          text='Search'
          icon={<SearchIcon />}
          onSelect={() => {
						setSearchDialogOpen(true)
					}}
        />
        <MainPanelAction
          text='All Content'
          icon={<AllContentIcon />}
          onSelect={() => {}}
        />
        <MainPanelAction
          text='All Views'
          icon={<AllViewsIcon />}
          onSelect={() => {}}
        />
        <MainPanelAction
          text='Data Structure'
          icon={<DataStructureIcon />}
          onSelect={() => {
            setDataStructureDialogOpen(true)
          }}
        />
      </div>

      <div className="menu-panel__favorites">
        <div className="menu-panel__favorites-header">
          <h3>Favorites</h3>
        </div>
        <div>
          No Favorites Found
        </div>
      </div>

      <div className="menu-panel__user">
        <button><AccountIcon/></button>
        <button><SettingsIcon/></button>
        <button><HelpIcon/></button>
      </div>

      {/*<div className="athena__ribbon-menu">*/}
      {/*    <DatabaseDialog/>*/}
      {/*    <div className="sidebar-divider"/>*/}
      {/*    <NewContentDialog/>*/}
      {/*    <SearchDialog/>*/}
      {/*    <DataStructureDialog/>*/}
      {/*    <div className="sidebar-separator"/>*/}
      {/*    <LogsDialog/>*/}
      {/*    <div className="sidebar-divider"/>*/}
      {/*    <AccountsDialog/>*/}
      {/*</div>*/}
    </div>
  )
}