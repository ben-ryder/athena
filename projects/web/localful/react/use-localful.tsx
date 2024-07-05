import {LocalfulWeb} from "../localful-web";
import {DataSchemaDefinition} from "../storage/types";
import {EntityDatabase} from "../storage/entity-database";
import { Context, createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import {LocalDatabaseDto} from "@localful-athena/types/database";

export interface LocalfulContext<DataSchema extends DataSchemaDefinition> {
	currentDatabase: EntityDatabase<DataSchema> | null
	currentDatabaseDto?: LocalDatabaseDto
	closeCurrentDatabase: () => Promise<void>
	openDatabase: LocalfulWeb<DataSchema>['openDatabase']
	createDatabase: LocalfulWeb<DataSchema>['createDatabase']
	updateDatabase: LocalfulWeb<DataSchema>['updateDatabase']
	deleteDatabase: LocalfulWeb<DataSchema>['deleteDatabase']
	deleteLocalDatabase:  LocalfulWeb<DataSchema>['deleteLocalDatabase']
	unlockDatabase: LocalfulWeb<DataSchema>['unlockDatabase']
	lockDatabase: LocalfulWeb<DataSchema>['lockDatabase']
	liveQueryDatabase:  LocalfulWeb<DataSchema>['liveQueryDatabase']
	liveGetDatabase:  LocalfulWeb<DataSchema>['liveGetDatabase']
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
	const [currentDatabase, setCurrentDatabase] = useState<null | EntityDatabase<DataSchema>>(null)

	const [currentDatabaseDto, setCurrentDatabaseDto] = useState<LocalDatabaseDto | undefined>(undefined)

	const _ensureDatabaseClosed = useCallback(async (databaseId: string) => {
		if (currentDatabase?.databaseId === databaseId) {
			await currentDatabase.close()
			setCurrentDatabase(() => {return null})
		}
	}, [currentDatabase])

	const closeCurrentDatabase = useCallback(async () => {
		if (currentDatabase) {
			await currentDatabase.close()
		}
	}, [currentDatabase])

	const openDatabase = useCallback(async (databaseId: string): Promise<EntityDatabase<DataSchema> | null> => {
		await closeCurrentDatabase()

		const newDatabase = await localful.openDatabase(databaseId)
		setCurrentDatabase(newDatabase)

		return newDatabase
	}, [closeCurrentDatabase])

	const createDatabase = useCallback(localful.createDatabase.bind(localful), [])

	const updateDatabase = useCallback(localful.updateDatabase.bind(localful), [])

	const deleteDatabase = useCallback(async (databaseId: string) => {
		await _ensureDatabaseClosed(databaseId)
		return localful.deleteDatabase(databaseId)
	}, [_ensureDatabaseClosed])

	const deleteLocalDatabase = useCallback(async (databaseId: string) => {
		await _ensureDatabaseClosed(databaseId)
		return localful.deleteLocalDatabase(databaseId)
	}, [_ensureDatabaseClosed])

	const unlockDatabase = useCallback(async (databaseId: string, password: string) => {
		const unlockSuccess = await localful.unlockDatabase(databaseId, password)
		if (unlockSuccess) {
			await openDatabase(databaseId)
		}

		return unlockSuccess
	}, [])

	const lockDatabase = useCallback(async (databaseId: string) => {
		if (currentDatabase?.databaseId === databaseId) {
			await _ensureDatabaseClosed(databaseId)
		}
		return localful.lockDatabase(databaseId)
	}, [_ensureDatabaseClosed])

	const liveQueryDatabase = useCallback(localful.liveQueryDatabase.bind(localful), [])

	const liveGetDatabase = useCallback(localful.liveGetDatabase.bind(localful), [])

	// Automatically update the currentDatabaseDto state when the currentDatabase changes
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
			console.debug('no current db, reset dto')
			setCurrentDatabaseDto(undefined)
		}
	}, [currentDatabase])

	return <LocalfulContext.Provider value={{
		currentDatabase,
		currentDatabaseDto,
		openDatabase,
		closeCurrentDatabase,
		createDatabase,
		updateDatabase,
		deleteDatabase,
		deleteLocalDatabase,
		unlockDatabase,
		lockDatabase,
		liveQueryDatabase,
		liveGetDatabase,
	}}>{props.children}</LocalfulContext.Provider>
}
