import React, {ReactNode, useState} from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import {ErrorTypes} from "@localful-athena/control-flow";
import {
	GenericManagerScreenProps
} from "../../../../common/generic-manager/generic-manager";
import { FieldDefinition } from "../../../../state/schemas/fields/fields";
import {BasicFieldForm} from "../forms/basic-field-form";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";
import { JArrowButton, JButton } from "@ben-ryder/jigsaw-react";
import {FIELD_TYPES, FieldTypes} from "../../../../state/schemas/fields/field-types";
import {MarkdownFieldForm} from "../forms/markdown-field-form";

export function CreateFieldScreen(props: GenericManagerScreenProps) {
	const [errors, setErrors] = useState<unknown[]>([])
	const { currentDatabase } = useLocalful<AthenaTableTypes, AthenaTableSchemas>()

	const [fieldType, setFieldType] = useState<FieldTypes|null>(null);

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

	if (!fieldType) {
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
					<JButton onClick={() => {setFieldType('textShort')}}>Short Text</JButton>
					<JButton onClick={() => {setFieldType('textLong')}}>Long Text</JButton>
					<JButton onClick={() => {setFieldType('markdown')}}>Markdown</JButton>
				</div>
				<div>
					<JButton onClick={() => {setFieldType('options')}}>Options</JButton>
					<JButton onClick={() => {setFieldType('url')}}>URL</JButton>
				</div>
				<div>
					<JButton onClick={() => {setFieldType('number')}}>Number</JButton>
					<JButton onClick={() => {setFieldType('scale')}}>Scale</JButton>
					<JButton onClick={() => {setFieldType('boolean')}}>Boolean</JButton>
				</div>
				<div>
					<JButton onClick={() => {setFieldType('date')}}>Date</JButton>
					<JButton onClick={() => {setFieldType('timestamp')}}>Timestamp</JButton>
				</div>
			</div>
		)
	}

	let createForm: ReactNode
	if (fieldType === 'markdown') {
		createForm = (
			<MarkdownFieldForm
				title={`Create Markdown Field`}
				data={{type: "markdown", label: "", lines: 3, required: false}}
				onSave={onSave}
				navigate={props.navigate}
			/>
		)
	}
	else if (fieldType === 'options') {
		createForm = <p>options</p>
	}
	else if (fieldType === 'scale') {
		createForm = <p>scale</p>
	}
	else {
		createForm = (
			<BasicFieldForm
				title={`Create ${FIELD_TYPES[fieldType].label} Field`}
				data={{ label: "", type: fieldType, required: false }}
				onSave={onSave}
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
			>Back</JArrowButton>
			<h2>{`Create ${FIELD_TYPES[fieldType].label} Field`}</h2>
			<div>
				{errors.length > 0 && <ErrorCallout errors={errors} />}
			</div>
			<div>
				{createForm}
			</div>
		</div>
	)
}
