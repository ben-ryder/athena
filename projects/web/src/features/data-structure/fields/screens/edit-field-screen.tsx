import React, {useState} from "react";
import {ErrorCallout} from "../../../../patterns/components/error-callout/error-callout";
import {ErrorTypes, LiveQueryStatus} from "@localful-athena/control-flow";
import {GenericManagerContentScreenProps,} from "../../../../common/generic-manager/generic-manager";
import {BasicFieldForm} from "../forms/basic-field-form";
import {FieldDefinition} from "../../../../state/schemas/fields/fields";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function EditFieldScreen(props: GenericManagerContentScreenProps) {
	const {currentDatabase} = useLocalful<AthenaTableTypes, AthenaTableSchemas>()
	const [errors, setErrors] = useState<unknown[]>([])

	const fieldQuery = useObservableQuery(currentDatabase?.liveGet('fields', props.id))

	async function onSave(updatedData: Partial<FieldDefinition>) {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		try {
			await currentDatabase.update('fields', props.id, updatedData)
			props.navigate({screen: "list"})
		}
		catch (e) {
			setErrors([e])
		}
	}

	async function onDelete() {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		try {
			await currentDatabase.delete('fields', props.id)
			props.navigate({screen: "list"})
		}
		catch (e) {
			setErrors([e])
		}
	}

	return (
		<div>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			{fieldQuery.status === LiveQueryStatus.LOADING && (
				<p>Loading...</p>
			)}
			{fieldQuery.status === LiveQueryStatus.SUCCESS &&
        <BasicFieldForm
        	title={`Edit Field '${fieldQuery.result.data.label}'`}
        	data={fieldQuery.result.data}
        	onSave={onSave}
        	onDelete={onDelete}
        	navigate={props.navigate}
        	disableTypeEdit={true}
        />
			}
		</div>
	);
}