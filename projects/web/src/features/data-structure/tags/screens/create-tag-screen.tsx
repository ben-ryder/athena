import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/schemas/tags/tags";
import {ErrorObject, ErrorTypes} from "@localful-athena/control-flow";
import {
	GenericManagerScreenProps
} from "../../../../common/generic-manager/generic-manager";
import { TagForm } from "../forms/tag-form";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function CreateTagScreen(props: GenericManagerScreenProps) {
	const {currentDatabase} = useLocalful<DATA_SCHEMA>()
	const [errors, setErrors] = useState<ErrorObject[]>([])

	async function onSave(data: TagData) {
		if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

		const res = await currentDatabase.create('tags', data)
		if (!res.success) {
			setErrors(res.errors)
		}
		else {
			props.navigate({screen: "list"})
		}
	}

	return (
		<>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			<TagForm
				title="Create Tag"
				data={{ name: "", colourVariant: undefined }}
				onSave={onSave}
				navigate={props.navigate}
			/>
		</>
	);
}