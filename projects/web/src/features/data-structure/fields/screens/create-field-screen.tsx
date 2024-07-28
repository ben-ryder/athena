import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import {ErrorTypes} from "@localful-athena/control-flow";
import {
	GenericManagerScreenProps
} from "../../../../common/generic-manager/generic-manager";
import { FieldDefinition } from "../../../../state/schemas/fields/fields";
import {BasicFieldForm} from "../forms/basic-field-form";
import { FIELD_TYPES, FieldTypes } from "../../../../state/schemas/fields/field-types";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";
import { JArrowButton, JButton } from "@ben-ryder/jigsaw-react";

export function CreateFieldScreen(props: GenericManagerScreenProps) {
	const [errors, setErrors] = useState<unknown[]>([])
	const { currentDatabase } = useLocalful<AthenaTableTypes, AthenaTableSchemas>()

	const [currentField, setCurrentField] = useState<FieldTypes|null>(null);

	async function onSave(data: FieldDefinition) {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		try {
			await currentDatabase.create('fields', data)
			props.navigate({screen: "list"})
		}
		catch (e) {
			setErrors([e])
		}
	}

	if (!currentField) {
		return (
			<div>
				<JArrowButton
					onClick={() => {
						props.navigate({screen: "list"})
					}}
					direction="left"
				>All Fields</JArrowButton>

				<p>Select field to create...</p>
				<div>
					<JButton onClick={() => {setCurrentField('plainTextShort')}}>Short Text</JButton>
					<JButton onClick={() => {setCurrentField('plainTextLong')}}>Long Text</JButton>
					<JButton onClick={() => {setCurrentField('markdown')}}>Markdown</JButton>
				</div>
				<div>
					<JButton onClick={() => {setCurrentField('options')}}>Options</JButton>
					<JButton onClick={() => {setCurrentField('url')}}>URL</JButton>
				</div>
				<div>
					<JButton onClick={() => {setCurrentField('number')}}>Number</JButton>
					<JButton onClick={() => {setCurrentField('scale')}}>Scale</JButton>
					<JButton onClick={() => {setCurrentField('boolean')}}>Boolean</JButton>
				</div>
				<div>
					<JButton onClick={() => {setCurrentField('date')}}>Date</JButton>
					<JButton onClick={() => {setCurrentField('timestamp')}}>Timestamp</JButton>
				</div>
			</div>
		)
	}

	return (
		<>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			<BasicFieldForm
				title="Create Field"
				data={{ label: "", type: FIELD_TYPES.markdown.identifier, required: true }}
				onSave={onSave}
				navigate={props.navigate}
				disableTypeEdit={false}
			/>
		</>
	);
}
