import { createContext, useContext } from "react";

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

export const _DatabaseDialogContext = createContext<DatabaseManagerDialogContext|undefined>(undefined)

export function useDatabaseManagerDialogContext() {
	const databaseDialogContext = useContext(_DatabaseDialogContext)
	if (!databaseDialogContext) {
		throw new Error('Attempted to use database dialog context outside provider.')
	}

	return databaseDialogContext
}
