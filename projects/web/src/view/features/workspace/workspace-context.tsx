import {createContext, ReactNode, useContext, useState} from "react";

export type WorkspaceTab = {
	type: 'content_new',
	contentTypeId: string
} | {
	type: 'content',
	contentId: string
} | {
	type: 'content_list'
} | {
	type: 'view_new'
} | {
	type: 'view',
	viewId: string
} | {
	type: 'view_list'
} | {
	type: 'search'
}


export interface WorkspaceContext {
	tabs: WorkspaceTab[]
	openTab: (tab: WorkspaceTab) => void
	closeTab: (tabIndex: number) => void
}

const DefaultWorkspaceContext: WorkspaceContext = {
	tabs: [],
	openTab: () => {},
	closeTab: () => {},
}

const WorkspaceContext = createContext<WorkspaceContext>(DefaultWorkspaceContext)

export const useWorkspaceContext = () => useContext(WorkspaceContext)

export function WorkspaceContextProvider(props: {children: ReactNode}) {
	const [tabs, setTabs] = useState<WorkspaceTab[]>([])

	function openTab(tab: WorkspaceTab) {
		setTabs([
			...tabs,
			tab
		])
	}

	function closeTab(index: number) {
		setTabs(tabs.toSpliced(index, 1))
	}

	return <WorkspaceContext.Provider value={{
		tabs: tabs,
		openTab: openTab,
		closeTab: closeTab
	}}>{props.children}</WorkspaceContext.Provider>
}