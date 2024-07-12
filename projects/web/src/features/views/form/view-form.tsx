import {FormEvent, useState} from "react";
import {
	JInput,
	JErrorText,
	JButtonGroup, JButton,
	JForm, JFormContent, JFormRow, JMultiSelectOptionData, JTextArea, JMultiSelect, JSelect
} from "@ben-ryder/jigsaw-react";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { LiveQueryStatus } from "@localful-athena/control-flow";
import { WithTabData } from "../../workspace/workspace";
import { ViewFormData, ViewFormDataHandlers } from "./useViewFormData";

import "./view-form.scss"
import {useLocalful} from "@localful-athena/react/use-localful";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../state/athena-localful";

export interface ViewFormProps extends WithTabData, ViewFormData, ViewFormDataHandlers {
	onSave: () => void;
	onDelete?: () => void;
}

// todo: handle situation where content form is open and content gets deleted?

export function ViewForm(props: ViewFormProps) {
	const {currentDatabase} = useLocalful<AthenaTableTypes, AthenaTableSchemas>()
	const [error, setError] = useState<string | null>(null);

	const allTags = useObservableQuery(currentDatabase?.liveQuery({table: 'tags'}))
	const tagOptions: JMultiSelectOptionData[] = allTags.status === LiveQueryStatus.SUCCESS
		? allTags.result.map(tag => ({
			text: tag.data.name,
			value: tag.id,
			variant: tag.data.colourVariant
		}))
		: []

	const allContentTypes = useObservableQuery(currentDatabase?.liveQuery({table: 'content_types'}))
	const contentTypeOptions: JMultiSelectOptionData[] = allContentTypes.status === LiveQueryStatus.SUCCESS
		? allContentTypes.result.map(contentType => ({
			text: contentType.data.name,
			value: contentType.id,
			variant: contentType.data.colourVariant
		}))
		: []

	function onSave(e: FormEvent) {
		e.preventDefault()

		if (props.name.length === 0) {
			setError("Your view must have a name");
		}
		else {
			setError(null);
			props.onSave();
		}
	}

	return (
		<JForm className="view-form" onSubmit={onSave}>
			<div className="view-form__header">
				{error && <JErrorText>{error}</JErrorText>}
			</div>
			<JFormContent>
				<JFormRow>
					<JInput
						label="Name"
						id="name"
						type="text"
						value={props.name}
						onChange={(e) => {
							props.onNameChange(e.target.value);
						}}
						placeholder="your view name..."
					/>
				</JFormRow>
				<JFormRow>
					<JSelect
						label="Favourite?"
						id="favourite"
						value={props.isFavourite ? 'yes' : 'no'}
						onChange={(e) => {
							props.onIsFavouriteChange(e.target.value === 'yes');
						}}
						options={[
							{
								text: 'No',
								value: 'no'
							},
							{
								text: 'Yes',
								value: 'yes'
							}
						]}
					/>
				</JFormRow>
				<JFormRow>
					<JTextArea
						label="Description"
						id="description"
						value={props.description || ''}
						rows={3}
						onChange={(e) => {
							props.onDescriptionChange(e.target.value);
						}}
						placeholder="a short descripction of your view..."
					/>
				</JFormRow>
				<JFormRow>
					<JMultiSelect
						id="tags"
						label="Tags"
						options={tagOptions}
						selectedOptions={
							props.tags
								? tagOptions.filter(option => props.tags.includes(option.value))
								: []
						}
						setSelectedOptions={(tags) => {
							props.onTagsChange(tags.map(option => option.value))
						}}
						searchText="search and select tags..."
						noOptionsText="No Tags Found"
					/>
				</JFormRow>
				<JFormRow>
					<JMultiSelect
						id="queryContentTypes"
						label="Query Content Types"
						options={contentTypeOptions}
						selectedOptions={
							props.queryContentTypes
								? contentTypeOptions.filter(option => props.queryContentTypes.includes(option.value))
								: []
						}
						setSelectedOptions={(tags) => {
							props.onQueryContentTypesChange(tags.map(option => option.value))
						}}
						searchText="search and select content types..."
						noOptionsText="No Content Types Found"
					/>
				</JFormRow>
				<JFormRow>
					<JMultiSelect
						id="queryTags"
						label="Query Tags"
						options={tagOptions}
						selectedOptions={
							props.queryTags
								? tagOptions.filter(option => props.queryTags.includes(option.value))
								: []
						}
						setSelectedOptions={(tags) => {
							props.onQueryTagsChange(tags.map(option => option.value))
						}}
						searchText="search and select tags..."
						noOptionsText="No Tags Found"
					/>
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
