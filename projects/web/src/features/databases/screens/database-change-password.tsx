import {useCallback} from "react";
import {useDatabaseManagerDialogContext} from "../manager/database-manager-context";
import {DatabaseChangePasswordForm} from "../forms/database-change-password-form";
import {JArrowButton} from "@ben-ryder/jigsaw-react";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {useLocalful} from "@localful-athena/react/use-localful";

export interface DatabaseChangePasswordScreenProps {
	databaseId: string
}

export function DatabaseChangePasswordScreen(props: DatabaseChangePasswordScreenProps) {
	const { liveGetDatabase } = useLocalful()
	const { setOpenTab } = useDatabaseManagerDialogContext()

	const onSuccess = useCallback(async () => {
		setOpenTab()
	}, [])

	const databaseQuery = useObservableQuery(liveGetDatabase(props.databaseId))

	return (
		<>
			<JArrowButton
				direction='left'
				onClick={() => {setOpenTab({type: 'list'})}}
			>All databases</JArrowButton>
			{databaseQuery.status === 'success' && (
				<p>Change password for {databaseQuery.data.name} database</p>
			)}
			<DatabaseChangePasswordForm
				databaseId={props.databaseId}
				onSuccess={onSuccess}
			/>
		</>
	)
}
