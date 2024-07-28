import { FormEvent, useMemo, useState } from "react";
import {
	JInput,
	JErrorText,
	JSelect,
	JOptionData, JButtonGroup, JButton, JArrowButton, JForm, JFormContent, JFormRow, JProse
} from "@ben-ryder/jigsaw-react";
import {GenericFormProps} from "../../../../common/generic-form/generic-form";
import {FieldDefinition} from "../../../../state/schemas/fields/fields";
import { FIELD_TYPES, FieldTypes, FieldTypes } from "../../../../state/schemas/fields/field-types";
import { useForm } from "react-hook-form";

export interface BasicFieldFormProps extends GenericFormProps<FieldDefinition> {
	disableTypeEdit: boolean
}

export function BasicFieldForm(props: FieldFormProps) {
	const [error, setError] = useState<string | null>(null);

	const [label, setLabel] = useState<string>(props.data.label);
	const [required, setRequired] = useState<boolean>(false);

	function onSave() {

	}

	const {} = useForm<>()

	return (
		<JForm className="content-form" onSubmit={onSave}>
			<div className="content-form__back">
				<JArrowButton
					onClick={() => {
						props.navigate({screen: "list"})
					}}
					direction="left"
				>Back</JArrowButton>
			</div>
			<div className="tag-form__header">
				<h2>{props.title}</h2>
				{error && <JErrorText>{error}</JErrorText>}
			</div>
			<JFormContent>
				<JFormRow>
					<JInput
						label="Label"
						id="label"
						type="text"
						value={label}
						onChange={(e) => {
							setLabel(e.target.value);
						}}
						placeholder="a field label..."
					/>
				</JFormRow>
				<JFormRow>
					<JSelect
						label="Type"
						id="type"
						options={fieldOptions}
						value={type}
						onChange={(e) => {setType(e.target.value as FieldTypes)}}
						disabled={props.disableTypeEdit}
					/>
					{props.disableTypeEdit &&
            <JProse>
            	<p><em>The type of a field can't be changed. This is to prevent compatibility issues with existing content that may already use this field.</em></p>
            </JProse>
					}
				</JFormRow>
			</JFormContent>

			<JFormRow>
				<JButtonGroup>
					{props.onDelete &&
            <JButton
            	type="button"
            	variant="destructive"
            	onClick={() => {
            		if (props.onDelete) {
            			props.onDelete()
            		}
            	}}
            >Delete</JButton>
					}
					<JButton type="submit">Save</JButton>
				</JButtonGroup>
			</JFormRow>
		</JForm>
	);
}
