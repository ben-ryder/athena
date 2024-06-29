import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import {PropsWithChildren} from "../../utils/children-prop";
import {JDialog} from "@ben-ryder/jigsaw-react";
import {DatabaseListScreen} from "./screens/database-list";
import {DatabaseCreateScreen} from "./screens/database-create";
import { useLocalful } from "@localful-athena/react/use-localful";
import { DatabaseEditScreen } from "./screens/database-edit";

export type DatabaseManagerTabs = {
	type: 'list',
} | {
	type: 'create'
} | {
	type: 'edit'
	databaseId: string
} |  {
	type: 'change-password'
	databaseId: string
} | {
	type: 'unlock'
	databaseId: string
}

export interface DatabaseManagerDialogContext {
	openTab?: DatabaseManagerTabs
	setOpenTab: (tab?: DatabaseManagerTabs) => void
	close: () => void
}

const DatabaseDialogContext = createContext<DatabaseManagerDialogContext|undefined>(undefined)

export function useDatabaseManagerDialogContext() {
	const databaseDialogContext = useContext(DatabaseDialogContext)
	if (!databaseDialogContext) {
		throw new Error('Attempted to use database dialog context outside provider.')
	}

	return databaseDialogContext
}

export function DatabaseManagerDialogProvider(props: PropsWithChildren) {
	const [openTab, _setOpenTab] = useState<DatabaseManagerTabs|undefined>(undefined)

	const setOpenTab = useCallback((tab?: DatabaseManagerTabs) => {
		_setOpenTab(tab ?? {type: 'list'})
	}, [])

	const close = useCallback(() => {
		_setOpenTab(undefined)
	}, [])

	return (
		<DatabaseDialogContext.Provider
			value={{
				openTab: openTab,
				setOpenTab,
				close
			}}
		>
			{props.children}
		</DatabaseDialogContext.Provider>
	)
}


export function DatabaseManagerDialog() {
	const { openTab, setOpenTab, close } = useDatabaseManagerDialogContext()

	const { currentDatabase } = useLocalful()

	let dialogContent: ReactNode
	switch (openTab?.type) {
		case "list": {
			dialogContent = <DatabaseListScreen />
			break;
		}
		case "create": {
			dialogContent = <DatabaseCreateScreen />
			break;
		}
		case "edit": {
			dialogContent = <DatabaseEditScreen databaseId={openTab.databaseId} />
			break;
		}
		case "change-password": {
			dialogContent = <p>change password {openTab.databaseId}</p>
			break;
		}
		case "unlock": {
			dialogContent = <p>Unlock db {openTab.databaseId}</p>
			break;
		}
		default: (
			dialogContent = <p>No Open Tab</p>
		)
	}

	// Keep the database manager open if there is no current database
	useEffect(() => {
		if (!currentDatabase && !openTab) {
			setOpenTab({type: 'list'})
		}
	}, [currentDatabase, openTab])

	return (
		<JDialog
			isOpen={!!openTab}
			setIsOpen={(isOpen) => {
				if (isOpen) {
					setOpenTab(isOpen ? {type: 'list'} : undefined)
				}
				else {
					close()
				}
			}}
			disableOutsideClose={!currentDatabase}
			title="Database Manager"
			description="Manage your current database"
			content={dialogContent}
		/>
	)
}
