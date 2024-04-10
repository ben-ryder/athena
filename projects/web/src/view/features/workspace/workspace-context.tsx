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
	name?: string,
	contentUnsaved?: boolean
}

export type WorkspaceTab = WorkspaceTabTypes & TabMetadata

export interface OpenTabOptions {
	switch: boolean
}

export interface WorkspaceContext {
	tabs: WorkspaceTab[]
	openTab: (tab: WorkspaceTab, options?: OpenTabOptions) => void
	closeTab: (tabIndex: number) => void
	replaceTab: (tabIndex: number, tab: WorkspaceTab) => void
	activeTab: number
	setActiveTab: (tabIndex: number) => void
	updateTabMetadata: (tabIndex: number, metadata: Partial<TabMetadata>) => void
}

const DefaultWorkspaceContext: WorkspaceContext = {
	tabs: [],
	openTab: () => {},
	closeTab: () => {},
	replaceTab: () => {},
	activeTab: 0,
	setActiveTab: () => {},
	updateTabMetadata: () => {}
}

const WorkspaceContext = createContext<WorkspaceContext>(DefaultWorkspaceContext)

export const useWorkspaceContext = () => useContext(WorkspaceContext)

export function WorkspaceContextProvider(props: {children: ReactNode}) {
	const [tabs, setTabs] = useState<WorkspaceTab[]>([])
	const [activeTab, setActiveTab] = useState<number>(0)

	const openTab = useCallback((tab: WorkspaceTab, options?: OpenTabOptions) => {
		setTabs([
			...tabs,
			tab
		])

		if (options?.switch) {
			// Don't need to -1 for zero index as length has increased in setTabs, it just won't reflect in state at this point.
			setActiveTab(tabs.length)
		}
	}, [tabs])

	const closeTab = useCallback((index: number) => {
		// todo: handle updating active tab when length changes
		setTabs(tabs.toSpliced(index, 1))
	}, [tabs])

	const isValidTabIndex = useCallback((tabIndex: number) => {
		return tabIndex === 0 || (tabIndex >= 0 && tabIndex < tabs.length)
	}, [tabs])

	const requestSetActiveTab = useCallback((tabIndex: number) => {
		if (isValidTabIndex(tabIndex)) {
			setActiveTab(tabIndex)
		}
		else {
			console.error('Attempted to set active tab outside current range of tabs')
			// todo: throw some sort of UI error too?
		}
	}, [tabs])

	const updateTabMetadata = useCallback((tabIndex: number, metadata: Partial<TabMetadata>) => {
		if (!isValidTabIndex(tabIndex)) {
			console.error(`Out of range tabIndex ${tabIndex} requested`)
			return;
		}

		if (typeof metadata.name === 'string' || metadata.contentUnsaved) {
			const newTabs = tabs.map((tab, index) => {

				let name: string|undefined = tab.name
				if (typeof metadata.name === 'string') {
					if (metadata.name.length == 0) name = undefined
					else name = metadata.name
				}

				if (index === tabIndex) {
					return {
						...tab,
						name: name,
						contentUnsaved: typeof metadata.contentUnsaved === "boolean" ? metadata.contentUnsaved : tab.contentUnsaved
					}
				}
				return tab
			})
			setTabs(newTabs)
		}
	}, [tabs, isValidTabIndex])

	const replaceTab = useCallback((tabIndex: number, newTab: WorkspaceTab) => {
		if (!isValidTabIndex(tabIndex)) {
			console.error(`Out of range tabIndex ${tabIndex} requested`)
			return;
		}

		const updatedTabs = tabs.map((tab, index) => {
			return index === tabIndex ? newTab : tab
		})
		setTabs(updatedTabs)
	}, [tabs])

	return <WorkspaceContext.Provider value={{
		tabs: tabs,
		openTab: openTab,
		closeTab: closeTab,
		replaceTab: replaceTab,
		activeTab: activeTab,
		setActiveTab: requestSetActiveTab,
		updateTabMetadata: updateTabMetadata
	}}>{props.children}</WorkspaceContext.Provider>
}