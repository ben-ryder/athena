import {LocalfulWeb} from "../localful-web";
import {DataSchemaDefinition} from "../storage/types";
import {EntityDatabase} from "../storage/entity-database";
import { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { LocalDatabaseDto } from "@localful-athena/types/database";
import {DatabaseStorage} from "@localful-athena/storage/databases";

export interface LocalfulContext<DataSchema extends DataSchemaDefinition> {
	localful: LocalfulWeb<DataSchema>
	currentDatabase?: EntityDatabase<DataSchema>
	currentDatabaseDto?: LocalDatabaseDto
	openDatabase: (databaseId: string) => Promise<EntityDatabase<DataSchema>>
	closeCurrentDatabase: () => Promise<void>
	lockDatabase: DatabaseStorage['lockDatabase']
	deleteDatabase: DatabaseStorage['delete']
	deleteLocalDatabase: DatabaseStorage['deleteLocal']
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
	const [currentDatabase, setCurrentDatabase] = useState<undefined | EntityDatabase<DataSchema>>()

	const [currentDatabaseDto, setCurrentDatabaseDto] = useState<LocalDatabaseDto | undefined>(undefined)

	const ensureDatabaseClosed = useCallback(async (databaseId: string) => {
		if (currentDatabase?.databaseId === databaseId) {
			await currentDatabase.close()
			setCurrentDatabase(undefined)
		}
	}, [currentDatabase])

	const closeCurrentDatabase = useCallback(async () => {
		if (currentDatabase) {
			await currentDatabase.close()
		}

		setCurrentDatabase(undefined)
	}, [currentDatabase])

	const openDatabase = useCallback(async (databaseId: string): Promise<EntityDatabase<DataSchema>> => {
		await closeCurrentDatabase()

		const newDatabase = await localful.openDatabase(databaseId)
		setCurrentDatabase(newDatabase)

		return newDatabase
	}, [closeCurrentDatabase])

	const lockDatabase = useCallback(async (databaseId: string) => {
		if (currentDatabase) {
			await ensureDatabaseClosed(databaseId)
			await localful.lockDatabase(databaseId)
		}
	}, [ensureDatabaseClosed])

	const deleteDatabase = useCallback(async (databaseId: string) => {
		await ensureDatabaseClosed(databaseId)
		return localful.deleteDatabase(databaseId)
	}, [ensureDatabaseClosed])

	const deleteLocalDatabase = useCallback(async (databaseId: string) => {
		await ensureDatabaseClosed(databaseId)
		return localful.deleteLocalDatabase(databaseId)
	}, [ensureDatabaseClosed])

	useEffect(() => {
		if (currentDatabase) {
			const dtoLiveQuery = localful.liveGetDatabase(currentDatabase.databaseId)
			const dtoSubscription = dtoLiveQuery.subscribe((dto) => {
				if (dto.status === 'success') {
					setCurrentDatabaseDto(dto.data)
				} else if (dto.status === 'error') {
					console.error(dto.errors)
					setCurrentDatabaseDto(undefined)
				}
			})

			return () => {
				dtoSubscription.unsubscribe()
			}

		} else {
			setCurrentDatabaseDto(undefined)
		}
	}, [currentDatabase])

	return <LocalfulContext.Provider value={{
		localful,
		currentDatabase,
		currentDatabaseDto,
		openDatabase,
		closeCurrentDatabase,
		lockDatabase,
		deleteDatabase,
		deleteLocalDatabase
	}}>{props.children}</LocalfulContext.Provider>
}
