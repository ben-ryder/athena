import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import {ErrorObject, ErrorTypes, QueryStatus} from "@localful-athena/control-flow";
import {
	GenericManagerContentScreenProps,
} from "../../../../common/generic-manager/generic-manager";
import {ContentTypeForm} from "../forms/content-type-form";
import {
	ContentTypeData
} from "../../../../state/schemas/content-types/content-types";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function EditContentTypeScreen(props: GenericManagerContentScreenProps) {
	const {currentDatabase} = useLocalful<DATA_SCHEMA>()
	const [errors, setErrors] = useState<ErrorObject[]>([])

	const contentTypeQuery = useObservableQuery(currentDatabase?.liveGet('content_types', props.id))

	async function onSave(updatedData: Partial<ContentTypeData>) {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		const res = await currentDatabase.update("content_types", props.id, updatedData)
		if (!res.success) {
			setErrors(res.errors)
		}
		else {
			props.navigate({screen: "list"})
		}
	}

	async function onDelete() {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		const res = await currentDatabase.delete('content_types', props.id)
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
			{contentTypeQuery.status === QueryStatus.LOADING && (
				<p>Loading...</p>
			)}
			{contentTypeQuery.status === QueryStatus.SUCCESS &&
        <ContentTypeForm
        	title={`Edit Content Type '${contentTypeQuery.data.data.name}'`}
        	data={contentTypeQuery.data.data}
        	onSave={onSave}
        	onDelete={onDelete}
        	navigate={props.navigate}
        />
			}
		</div>
	);
}