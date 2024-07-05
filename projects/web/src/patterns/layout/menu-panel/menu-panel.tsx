
import {
	PenLine as EditIcon,
	Database as DatabaseListIcon,
	CloudDownload as StatusDownloadIcon,
	PlusSquare as NewContentIcon,
	Search as SearchIcon,
	List as AllContentIcon,
	Filter as AllViewsIcon,
	Shapes as DataStructureIcon,
	Settings as SettingsIcon,
	HelpCircle as HelpIcon,
	UserCircle as AccountIcon,
} from "lucide-react"
import {MainPanelAction} from "./main-panel-action";

import './menu-panel.scss'
import { JIcon, JTooltip } from "@ben-ryder/jigsaw-react";
import {useNewContentDialog} from "../../../features/new-content/new-content-dialog";
import {useStatusDialog} from "../../../features/status/status-dialog";
import {useSearchDialog} from "../../../features/search/dialog/search-dialog";
import {useDataStructureDialog} from "../../../features/data-structure/data-structure-dialog";
import { useViewsDialog } from "../../../features/views/dialog/views-dialog";
import {useContentListDialog} from "../../../features/content-list/dialog/content-list-dialog";
import {useSettingsDialog} from "../../../features/settings/settings-dialog";
import {useLocalful} from "@localful-athena/react/use-localful";
import {useDatabaseManagerDialogContext} from "../../../features/databases/manager/database-manager-context";

export interface WithMenuPanelControl {
	menuPanelIsOpen: boolean
	setMenuPanelIsOpen: (isOpen: boolean) => void
}

export function MenuPanel() {
	const {setOpenTab: setDatabaseManagerDialogTab } = useDatabaseManagerDialogContext()
	const {setIsOpen: setNewContentDialogOpen } = useNewContentDialog()
	const {setIsOpen: setStatusDialogOpen } = useStatusDialog()
	const {setIsOpen: setSearchDialogOpen } = useSearchDialog()
	const {setIsOpen: setDataStructureDialogOpen } = useDataStructureDialog()
	const {setIsOpen: setViewsDialogOpen } = useViewsDialog()
	const {setIsOpen: setContentListDialogOpen } = useContentListDialog()
	const {setIsOpen: setSettingsDialogOpen } = useSettingsDialog()

	const { currentDatabase, currentDatabaseDto } = useLocalful()

	return (
		<div className="menu-panel">
			<div className="menu-panel__database">
				<div className="menu-panel__database-content">
					<JTooltip content='Edit Database' renderAsChild={true} variant='dark'>
						<button
							className="menu-panel__database-edit"
							onClick={() => {
								if (currentDatabase) {
									setDatabaseManagerDialogTab({type: 'edit', databaseId: currentDatabase.databaseId})
								}
							}}
						>
							<span className="menu-panel__database-name" tabIndex={-1}>{currentDatabaseDto && currentDatabaseDto.name}</span>
							{currentDatabase && <JIcon size='sm'><EditIcon/></JIcon>}
						</button>
					</JTooltip>
					<JTooltip content="All Databases" renderAsChild={true} variant='dark'>
						<button
							className="menu-panel__database-switch"
							onClick={() => {
								setDatabaseManagerDialogTab({type: 'list'})
							}}
						><JIcon><DatabaseListIcon /></JIcon></button>
					</JTooltip>
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
					<JTooltip content="Account" renderAsChild={true} variant='dark'>
						<button
							className="menu-panel__account"
							onClick={() => {
								setSettingsDialogOpen(true)
							}}
						><AccountIcon/></button>
					</JTooltip>
					<JTooltip content="Settings" renderAsChild={true} variant='dark'>
						<button
							className="menu-panel__settings"
							onClick={() => {
								setSettingsDialogOpen(true)
							}}
						><SettingsIcon/></button>
					</JTooltip>
					<JTooltip content='Logs' renderAsChild={true} variant='dark'>
						<button
							className="menu-panel__logs"
							onClick={() => {
								setStatusDialogOpen(true);
							}}
						><JIcon><StatusDownloadIcon /></JIcon></button>
					</JTooltip>
					<JTooltip content="Help" renderAsChild={true} variant='dark'>
						<button
							className="menu-panel__help"
						><HelpIcon/></button>
					</JTooltip>
				</div>
			</div>
		</div>
	)
}