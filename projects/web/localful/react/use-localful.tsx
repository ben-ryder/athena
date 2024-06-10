import {LocalfulWeb} from "../localful-web";
import {DataSchemaDefinition} from "../storage/types";
import {LocalfulDatabase} from "../storage/database";
import {Context, createContext, PropsWithChildren, useCallback, useContext, useState} from "react";

export interface LocalfulContext<DataSchema extends DataSchemaDefinition> {
	localful: LocalfulWeb<DataSchema>
	currentDatabase?: LocalfulDatabase<DataSchema>
	openDatabase: (databaseId: string) => Promise<LocalfulDatabase<DataSchema>>
	closeDatabase: () => Promise<void>
}

// eslint-disable-next-line -- can't know the generic type when declaring static variable. The useLocalful hook can then accept the generic.
const LocalfulContext = createContext<LocalfulContext<any> | undefined>(undefined)

export function useLocalful<DataSchema extends DataSchemaDefinition>() {
	const localfulContext = useContext<LocalfulContext<DataSchema> | undefined>(
		LocalfulContext as unknown as Context<LocalfulContext<DataSchema> | undefined>
	)
	if (!localfulContext) {
		throw new Error('You attempted to use the Localful context without using a Provider.')
	}

	return localfulContext as unknown as LocalfulContext<DataSchema>
}

export interface LocalfulContextProviderProps<DataSchema> extends PropsWithChildren {
	dataSchema: DataSchema
}

export function LocalfulContextProvider<DataSchema extends DataSchemaDefinition>(props: LocalfulContextProviderProps<DataSchema>) {
	const [localful] = useState(() => new LocalfulWeb<DataSchema>({
		dataSchema: props.dataSchema
	}))
	const [currentDatabase, setCurrentDatabase] = useState<undefined | LocalfulDatabase<DataSchema>>()


	const closeDatabase = useCallback(async () => {
		if (currentDatabase) {
			await currentDatabase.close()
		}
	}, [currentDatabase])

	const openDatabase = useCallback(async (databaseId: string): Promise<LocalfulDatabase<DataSchema>> => {
		await closeDatabase()

		const newDatabase = await localful.openDatabase(databaseId)
		setCurrentDatabase(newDatabase)

		return newDatabase
	}, [closeDatabase])

	return <LocalfulContext.Provider value={{
		localful: localful,
		currentDatabase: currentDatabase,
		openDatabase: openDatabase,
		closeDatabase: closeDatabase,
	}}>{props.children}</LocalfulContext.Provider>
}
