
import {
    PenLine as EditIcon,
    ArrowRightLeft as DatabaseSwitchIcon,
    CloudDownload as StatusDownloadIcon,
    PlusSquare as NewContentIcon,
    Search as SearchIcon,
    List as AllContentIcon,
    Filter as AllViewsIcon,
} from "lucide-react"
import {MainPanelAction} from "./main-panel-action";

import './menu-panel.scss'
import {JIcon} from "@ben-ryder/jigsaw-react";

export interface WithMenuPanelControl {
    menuPanelIsOpen: boolean
    setMenuPanelIsOpen: (isOpen: boolean) => void
}

export function MenuPanel() {

    return (
        <div className="menu-panel">
            <div className="menu-panel__database">
                <div className="menu-panel__database-content">
                    <button className="menu-panel__database-edit">
                        <span className="menu-panel__database-name">Example Database rega rao afowhr eowhaf waeof</span>
                        <JIcon size='sm'><EditIcon/></JIcon>
                    </button>
                    <button className="menu-panel__database-status"><JIcon><StatusDownloadIcon/></JIcon></button>
                    <button className="menu-panel__database-switch"><JIcon><DatabaseSwitchIcon/></JIcon></button>
                </div>
            </div>

            <div className="menu-panel__actions">
                <MainPanelAction text='New Content' icon={<JIcon variant='blueGrey'><NewContentIcon/></JIcon>}
                                 onSelect={() => {
                                 }}/>
                <MainPanelAction text='Search' icon={<SearchIcon/>} onSelect={() => {
                }}/>
                <MainPanelAction text='All Content' icon={<AllContentIcon/>} onSelect={() => {
                }}/>
                <MainPanelAction text='All Views' icon={<AllViewsIcon/>} onSelect={() => {
                }}/>
                <MainPanelAction text='Data Structure' icon={<NewContentIcon/>} onSelect={() => {
                }}/>
            </div>

            <div className="menu-panel__favorites">

            </div>

            <div className="menu-panel__user">

            </div>

            {/*<div className="athena__ribbon-menu">*/}
            {/*    <DatabaseDialog/>*/}
            {/*    <div className="sidebar-divider"/>*/}
            {/*    <NewContentDialog/>*/}
            {/*    <SearchDialog/>*/}
            {/*    <SettingsDialog/>*/}
            {/*    <div className="sidebar-separator"/>*/}
            {/*    <LogsDialog/>*/}
            {/*    <div className="sidebar-divider"/>*/}
            {/*    <AccountsDialog/>*/}
            {/*</div>*/}
        </div>
    )
}