import React, { useState } from "react";
import { TagForm } from "../forms/tag-form";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/schemas/tags/tags";
import {ErrorObject, ErrorTypes, QueryStatus} from "@localful-athena/control-flow";
import {
	GenericManagerContentScreenProps,
} from "../../../../common/generic-manager/generic-manager";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import {useLocalful} from "@localful-athena/react/use-localful";


export function EditTagScreen(props: GenericManagerContentScreenProps) {
	const {currentDatabase} = useLocalful<DATA_SCHEMA>()
	const [errors, setErrors] = useState<ErrorObject[]>([])

	const tagResult = useObservableQuery(currentDatabase?.liveGet('tags', props.id))

	async function onSave(updatedData: Partial<TagData>) {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		const res = await currentDatabase.update('tags', props.id, updatedData)
		if (!res.success) {
			setErrors(res.errors)
		}
		else {
			props.navigate({screen: "list"})
		}
	}

	async function onDelete() {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		const res = await currentDatabase.delete('tags', props.id)
		if (!res.success) {
			setErrors(res.errors)
		}
		else {
			props.navigate({screen: "list"})
		}
	}

	return (
		<div>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			{tagResult.status === QueryStatus.LOADING && (
				<p>Loading...</p>
			)}
			{tagResult.status === QueryStatus.SUCCESS &&
        <TagForm
        	title={`Edit Tag '${tagResult.data.data.name}'`}
        	data={{
        		name: tagResult.data.data.name,
        		colourVariant: tagResult.data.data.colourVariant,
        	}}
        	onSave={onSave}
        	onDelete={onDelete}
        	navigate={props.navigate}
        />
			}
		</div>
	);
}