import React, {createContext, useCallback, useContext, useState} from "react";
import {PropsWithChildren} from "../../utils/children-prop";
import {JDialog} from "@ben-ryder/jigsaw-react";

export type DatabaseManagerTabs = {
    type: 'list',
} | {
    type: 'create'
} | {
    type: 'edit'
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
            title="Manage your database"
            description="Manage your current database"
            content={
                <p>Manage the database: {openTab?.type}</p>
            }
        />
    )
}
