import {createContext, ReactNode, useCallback, useContext, useState} from "react";

export type WorkspaceTabTypes = {
	type: 'content_new',
	contentTypeId: string
} | {
	type: 'content',
	contentId: string
} | {
	type: 'view_new'
} | {
	type: 'view',
	viewId: string
} | {
	type: 'search'
}

export interface TabMetadata {
	name?: string,
	isUnsaved?: boolean
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
	setTabIsUnsaved: (tabIndex: number, hasUnsaved: boolean) => void
	setTabName: (tabIndex: number, name: string) => void
}

const DefaultWorkspaceContext: WorkspaceContext = {
	tabs: [],
	openTab: () => {},
	closeTab: () => {},
	replaceTab: () => {},
	activeTab: 0,
	setActiveTab: () => {},
	setTabIsUnsaved: () => {},
	setTabName: () => {}
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

		// Check against current length, after this new tab length will be one
		if (options?.switch || tabs.length === 0) {
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

	const setTabIsUnsaved = useCallback((tabIndex: number, isUnsaved: boolean) => {
		if (!isValidTabIndex(tabIndex)) {
			console.error(`Out of range tabIndex ${tabIndex} requested`)
			return;
		}
		setTabs((oldTabs) => {
			return oldTabs.map((tab, index) => {
				if (index === tabIndex) {
					return {
						...tab,
						isUnsaved
					}
				}
				return tab
			})
		})
	}, [tabs, isValidTabIndex])

	const setTabName = useCallback((tabIndex: number, name: string) => {
		if (!isValidTabIndex(tabIndex)) {
			console.error(`Out of range tabIndex ${tabIndex} requested`)
			return;
		}
		setTabs((oldTabs) => {
			return oldTabs.map((tab, index) => {
				if (index === tabIndex) {
					return {
						...tab,
						name: name !== '' ? name : undefined,
					}
				}
				return tab
			})
		})
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
		setTabIsUnsaved: setTabIsUnsaved,
		setTabName: setTabName
	}}>{props.children}</WorkspaceContext.Provider>
}