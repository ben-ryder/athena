import {useCallback} from "react";
import {useDatabaseManagerDialogContext} from "../database-manager";
import {DatabaseUnlockForm} from "../forms/database-unlock-form";

export interface DatabaseUnlockScreenProps {
	databaseId: string
}

export function DatabaseUnlockScreen(props: DatabaseUnlockScreenProps) {
	const { setOpenTab } = useDatabaseManagerDialogContext()

	const onSuccess = useCallback(async () => {
		setOpenTab()
	}, [])

	return (
		<DatabaseUnlockForm
			databaseId={props.databaseId}
			onSuccess={onSuccess}
		/>
	)
}
