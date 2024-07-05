import {DatabaseBasicDataForm} from "../forms/database-basic-data-form";
import {useCallback} from "react";
import {LocalDatabaseFields} from "@localful-athena/types/database";
import {useLocalful} from "@localful-athena/react/use-localful";
import {JArrowButton, JArrowLink, JButton} from "@ben-ryder/jigsaw-react";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import {useDatabaseManagerDialogContext} from "../manager/database-manager-context";

export interface DatabaseEditScreenProps {
	databaseId: string
}

export function DatabaseEditScreen(props: DatabaseEditScreenProps) {
	const { setOpenTab } = useDatabaseManagerDialogContext()

	const {
		currentDatabase,
		currentDatabaseDto,
		lockDatabase,
		updateDatabase,
		deleteLocalDatabase,
		deleteDatabase,
		liveGetDatabase,
	} = useLocalful()

	const onSave = useCallback(async (basicInfo: LocalDatabaseFields) => {
		console.debug(basicInfo)

		try {
			const result = await updateDatabase(
				props.databaseId,
				{
					name: basicInfo.name,
					syncEnabled: basicInfo.syncEnabled
				}
			)
			if (result.success) {
				setOpenTab()
			}
			else {
				console.error(result.errors)
			}
		}
		catch (e) {
			console.error(e)
		}

	}, [updateDatabase])

	const onDelete = useCallback(async () => {
		try {
			const result = await deleteDatabase(props.databaseId)
			if (result.success) {
				setOpenTab()
			}
			else {
				console.error(result.errors)
			}
		}
		catch (e) {
			console.error(e)
		}
	}, [currentDatabase])

	const onLocalDelete = useCallback(async () => {
		try {
			const result = await deleteLocalDatabase(props.databaseId)
			if (result.success) {
				setOpenTab()
			}
			else {
				console.error(result.errors)
			}
		}
		catch (e) {
			console.error(e)
		}
	}, [currentDatabase])

	const onLock = useCallback(async () => {
		try {
			await lockDatabase(props.databaseId)
			setOpenTab()
		}
		catch (e) {
			console.error(e)
		}
	}, [])

	const databaseQuery = useObservableQuery(liveGetDatabase(props.databaseId))

	if (databaseQuery.status === 'loading') {
		return (
			<p>Loading...</p>
		)
	}

	if (databaseQuery.status === 'error') {
		return (
			<ErrorCallout errors={databaseQuery.errors} />
		)
	}

	return (
		<div>
			<JArrowButton
				direction='left'
				onClick={() => {setOpenTab({type: 'list'})}}
			>All databases</JArrowButton>
			<h2>Edit Database {databaseQuery.data.name}</h2>
			<JButton
				variant='secondary'
				onClick={() => {
					setOpenTab({type: 'change-password', databaseId: props.databaseId})
				}}
			>Change password</JButton>
			{currentDatabaseDto?.isUnlocked && (
				<JButton
					variant='secondary'
					onClick={async () => {
						await onLock()
					}}
				>Lock</JButton>
			)}
			<DatabaseBasicDataForm
				saveText='Save'
				onSave={onSave}
				initialData={{
					name: databaseQuery.data.name,
					syncEnabled: databaseQuery.data.syncEnabled
				}}
				extraButtons={
					<>
						<JButton
							type="button"
							variant="secondary"
							onClick={() => {
								onLocalDelete()
							}}
						>Delete Locally</JButton>
						<JButton
							type="button"
							variant="destructive"
							onClick={() => {
								onDelete()
							}}
						>Delete</JButton>
					</>
				}
			/>
		</div>
	)
}