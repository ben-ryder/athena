import {DatabaseBasicDataForm} from "../forms/database-basic-data-form";
import {useCallback} from "react";
import {LocalDatabaseFields} from "@localful-athena/types/database";
import {useLocalful} from "@localful-athena/react/use-localful";
import {useDatabaseManagerDialogContext} from "../database-manager";
import { JButton } from "@ben-ryder/jigsaw-react";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";

export interface DatabaseEditScreenProps {
	databaseId: string
}

export function DatabaseEditScreen(props: DatabaseEditScreenProps) {
	const { setOpenTab } = useDatabaseManagerDialogContext()

	const {
		localful,
		currentDatabase,
		currentDatabaseDto,
		lockDatabase,
		deleteLocalDatabase,
		deleteDatabase,
	} = useLocalful()

	const onSave = useCallback(async (basicInfo: LocalDatabaseFields) => {
		console.debug(basicInfo)

		try {
			const result = await localful.updateDatabase(
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

	}, [])

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

	const dtoQuery = useObservableQuery(localful.liveGetDatabase(props.databaseId))

	if (dtoQuery.status === 'loading') {
		return (
			<p>Loading...</p>
		)
	}

	if (dtoQuery.status === 'error') {
		return (
			<ErrorCallout errors={dtoQuery.errors} />
		)
	}

	return (
		<div>
			<h2>Edit Database</h2>
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
						await lockDatabase(props.databaseId)
					}}
				>Lock</JButton>
			)}
			<DatabaseBasicDataForm
				saveText='Save'
				onSave={onSave}
				initialData={{
					name: dtoQuery.data.name,
					syncEnabled: dtoQuery.data.syncEnabled
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