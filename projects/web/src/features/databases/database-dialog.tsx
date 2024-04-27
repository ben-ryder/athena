import {createModalContext} from "../../common/dialog/generic-dialog";
import React from "react";
import {JDialog} from "@ben-ryder/jigsaw-react";

export const {
	context: DatabaseDialogContext,
	useContext: useDatabaseDialog,
	provider: DatabaseDialogProvider
} = createModalContext()

export function DatabaseDialog() {
	const {isOpen, setIsOpen} = useDatabaseDialog()

	return (
		<JDialog
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			title="Manage your database"
			description="Manage your current database"
			content={
				<p>Manage the database</p>
			}
		/>
	)
}
