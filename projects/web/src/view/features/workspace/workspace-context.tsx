import {createContext, ReactNode, useCallback, useContext, useState} from "react";

export type WorkspaceTabTypes = {
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

export interface TabMetadata {
	name: string,
	contentUnsaved: boolean
}

export type WorkspaceTab = WorkspaceTabTypes & TabMetadata

export interface WorkspaceContext {
	tabs: WorkspaceTab[]
	openTab: (tab: WorkspaceTab) => void
	closeTab: (tabIndex: number) => void
	activeTab: number
	setActiveTab: (tabIndex: number) => void
	updateTabMetadata: (tabIndex: number, metadata: Partial<TabMetadata>) => void
}

const DefaultWorkspaceContext: WorkspaceContext = {
	tabs: [],
	openTab: () => {},
	closeTab: () => {},
	activeTab: 0,
	setActiveTab: () => {},
	updateTabMetadata: () => {}
}

const WorkspaceContext = createContext<WorkspaceContext>(DefaultWorkspaceContext)

export const useWorkspaceContext = () => useContext(WorkspaceContext)

export function WorkspaceContextProvider(props: {children: ReactNode}) {
	const [tabs, setTabs] = useState<WorkspaceTab[]>([])
	const [activeTab, setActiveTab] = useState<number>(0)

	const openTab = useCallback((tab: WorkspaceTab) => {
		setTabs([
			...tabs,
			tab
		])
	}, [])

	const closeTab = useCallback((index: number) => {
		setTabs(tabs.toSpliced(index, 1))
	}, [])

	const isValidTabIndex = useCallback((tabIndex: number) => {
		return tabIndex === 0 || (tabIndex >= 0 && tabIndex < tabs.length)
	}, [])

	const requestSetActiveTab = useCallback((tabIndex: number) => {
		if (isValidTabIndex(tabIndex)) {
			setActiveTab(tabIndex)
		}
		else {
			console.error('Attempted to set active tab outside current range of tabs')
			// todo: throw some sort of UI error too?
		}
	}, [])

	const updateTabMetadata = useCallback((tabIndex: number, metadata: Partial<TabMetadata>) => {
		if (!isValidTabIndex(tabIndex)) return

		if (metadata.name) {
			setTabs((tabs) => {
				// @ts-expect-error - undefined check is done above
				tabs[tabIndex].name = metadata.name
				return tabs
			})
		}
		if (metadata.contentUnsaved) {
			setTabs((tabs) => {
				// @ts-expect-error - undefined check is done above
				tabs[tabIndex].contentUnsaved = metadata.contentUnsaved
				return tabs
			})
		}
	}, [])

	return <WorkspaceContext.Provider value={{
		tabs: tabs,
		openTab: openTab,
		closeTab: closeTab,
		activeTab: activeTab,
		setActiveTab: requestSetActiveTab,
		updateTabMetadata: updateTabMetadata
	}}>{props.children}</WorkspaceContext.Provider>
}