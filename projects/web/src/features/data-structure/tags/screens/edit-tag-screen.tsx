import React, { useState } from "react";
import { TagForm } from "../forms/tag-form";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/schemas/tags/tags";
import {ErrorTypes, LiveQueryStatus} from "@localful-athena/control-flow";
import {
	GenericManagerContentScreenProps,
} from "../../../../common/generic-manager/generic-manager";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import {useLocalful} from "@localful-athena/react/use-localful";


export function EditTagScreen(props: GenericManagerContentScreenProps) {
	const {currentDatabase} = useLocalful<DATA_SCHEMA>()
	const [errors, setErrors] = useState<unknown[]>([])

	const tagResult = useObservableQuery(currentDatabase?.liveGet('tags', props.id))

	async function onSave(updatedData: Partial<TagData>) {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		try {
			await currentDatabase.update('tags', props.id, updatedData)
			props.navigate({screen: "list"})
		}
		catch (e) {
			setErrors([e])
		}
	}

	async function onDelete() {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		try {
			await currentDatabase.delete('tags', props.id)
			props.navigate({screen: "list"})
		}
		catch (e) {
			setErrors([e])
		}
	}

	return (
		<div>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			{tagResult.status === LiveQueryStatus.LOADING && (
				<p>Loading...</p>
			)}
			{tagResult.status === LiveQueryStatus.SUCCESS &&
        <TagForm
        	title={`Edit Tag '${tagResult.result.data.name}'`}
        	data={{
        		name: tagResult.result.data.name,
        		colourVariant: tagResult.result.data.colourVariant,
        	}}
        	onSave={onSave}
        	onDelete={onDelete}
        	navigate={props.navigate}
        />
			}
		</div>
	);
}