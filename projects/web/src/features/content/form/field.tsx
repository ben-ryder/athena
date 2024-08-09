import {FieldDefinition} from "../../../state/schemas/fields/fields";
import {JInput, JSelect, JTextArea} from "@ben-ryder/jigsaw-react";
import {ChangeEvent, useCallback} from "react";

export interface FieldProps {
	field: FieldDefinition
	// todo: look at improving types here
	value?: any
	onChange: (value: any) => void
}

export function CustomField(props: FieldProps) {

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
		props.onChange(e.target.value)
	}, [])

	if (props.field.type === 'scale') {
		return <p>scale</p>
	}
	else if (props.field.type === 'options') {
		return (
			<JSelect
				label={props.field.label}
				tooltip={props.field.description ? {content: props.field.description} : undefined}
				options={props.field.options.map(option => ({
					text: option,
					value: option
				}))}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'markdown') {
		return (
			<JTextArea
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				rows={props.field.lines}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'boolean') {
		return (
			<JInput
				type='checkbox'
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				value={props.value || false}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'timestamp') {
		return (
			<JInput
				type='datetime-local'
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'date') {
		return (
			<JInput
				type='date'
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'url') {
		return (
			<JInput
				type='url'
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'number') {
		return (
			<JInput
				type='number'
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				value={props.value || 0}
				onChange={onChange}
			/>
		)
	}
	else if (props.field.type === 'textLong') {
		return (
			<JTextArea
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				rows={4}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}
	else {
		return (
			<JInput
				label={props.field.label}
				required={props.field.required}
				placeholder={props.field.description}
				value={props.value || ''}
				onChange={onChange}
			/>
		)
	}

}