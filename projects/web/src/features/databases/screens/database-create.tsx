import {DatabaseBasicDataForm} from "../forms/database-basic-data-form";
import {useCallback, useState} from "react";
import {LocalDatabaseFields} from "@localful-athena/types/database";
import {DatabasePasswordForm} from "../forms/database-password-form";
import {useLocalful} from "@localful-athena/react/use-localful";
import {useDatabaseManagerDialogContext} from "../database-manager";

export type DatabaseCreateSteps = 'basic-info' | 'encryption'

export function DatabaseCreateScreen() {
	const { setOpenTab } = useDatabaseManagerDialogContext()

	const [currentStep, setCurrentStep] = useState<DatabaseCreateSteps>('basic-info')
	const [basicInfo, setBasicInfo] = useState<LocalDatabaseFields | undefined>(undefined)

	const { localful } = useLocalful()

	const onBasicInfoNext = useCallback((basicInfo: LocalDatabaseFields) => {
		setBasicInfo(basicInfo)
		setCurrentStep('encryption')
	}, [])

	const onBack = useCallback(() => {
		setCurrentStep('basic-info')
	}, [])

	const onSave = useCallback(async (password: string) => {
		console.debug(basicInfo)
		console.debug(password)
		if (!basicInfo) {
			console.error('No basic info set')
			return
		}

		try {
			await localful.createDatabase({
				name: basicInfo.name,
				syncEnabled: basicInfo.syncEnabled
			}, password)

			setOpenTab({type: 'list'})
		}
		catch (e) {
			console.error(e)
		}

	}, [basicInfo])

	return (
		<div>
			{currentStep === 'basic-info' && (
				<DatabaseBasicDataForm
					saveText='Next Step'
					onSave={onBasicInfoNext}
					initialData={basicInfo}
				/>
			)}
			{currentStep === 'encryption' && (
				<DatabasePasswordForm
					saveText='Create Database'
					onSave={onSave}
					cancelText='Back'
					onCancel={onBack}
				/>
			)}
		</div>
	)
}