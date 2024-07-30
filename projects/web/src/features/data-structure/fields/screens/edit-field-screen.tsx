import React, {ReactNode, useState} from "react";
import {ErrorCallout} from "../../../../patterns/components/error-callout/error-callout";
import {ErrorTypes} from "@localful-athena/control-flow";
import {GenericManagerContentScreenProps,} from "../../../../common/generic-manager/generic-manager";
import {BasicFieldForm} from "../forms/basic-field-form";
import {FieldDefinition} from "../../../../state/schemas/fields/fields";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";
import {JArrowButton} from "@ben-ryder/jigsaw-react";
import {FIELD_TYPES} from "../../../../state/schemas/fields/field-types";
import {MarkdownFieldForm} from "../forms/markdown-field-form";

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

	let content: ReactNode
	if (fieldQuery.status === 'loading') {
		content = <p>loading...</p>
	}
	else if (fieldQuery.status === 'error') {
		content = <ErrorCallout errors={fieldQuery.errors} />
	}
	else if (fieldQuery.result.data.type === 'markdown') {
		content = (
			<MarkdownFieldForm
				data={fieldQuery.result.data}
				onSave={onSave}
				onDelete={onDelete}
				navigate={props.navigate}
			/>
		)
	}
	else if (fieldQuery.result.data.type === 'options') {
		content = <p>options</p>
	}
	else if (fieldQuery.result.data.type === 'scale') {
		content = <p>scale</p>
	}
	else {
		content = (
			<BasicFieldForm
				data={fieldQuery.result.data}
				onSave={onSave}
				onDelete={onDelete}
				navigate={props.navigate}
			/>
		)
	}

	return (
		<div>
			<JArrowButton
				onClick={() => {
					props.navigate({screen: "list"})
				}}
				direction="left"
			>All Fields</JArrowButton>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			{fieldQuery.status === 'success' && (
				<h2>{`Edit ${FIELD_TYPES[fieldQuery.result.data.type].label} Field '${fieldQuery.result.data.label}'`}</h2>
			)}
			{content}
		</div>
	);
}