import { GenericManagerScreenProps } from "../../../../common/generic-manager/generic-manager";
import { AdminList, AdminListItemProps } from "../../../../patterns/layout/admin-list/admin-list";
import React, { useState } from "react";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { FIELD_TYPES } from "../../../../state/schemas/fields/field-types";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function ListFieldsScreen(props: GenericManagerScreenProps) {
	const [errors, setErrors] = useState<ErrorObject[]>([])

	const { currentDatabase } = useLocalful<DATA_SCHEMA>()

	const fields = useObservableQuery(currentDatabase?.liveQuery({table: 'fields'}))

	const listItems: AdminListItemProps[] = fields.status === QueryStatus.SUCCESS
		? fields.data.map(field => ({
			id: field.id,
			title: field.data.label,
			description: `type: ${FIELD_TYPES[field.data.type].label} | entity: ${field.id} | version: ${field.versionId} | created: ${field.createdAt} | updated: ${field.updatedAt}`,
			navigate: props.navigate
		}))
		: []

	return (
		<>
			{errors.length > 0 && <ErrorCallout errors={errors} />}
			<AdminList
				title="Fields"
				description="Fields are the most important part of content structure as they define what data you actually want to store. Fields are added to content types, and then when creating content you fill in the fields defined on that content type."
				addNewText="New Field"
				noItemsText="No Fields Found"
				loadingText="Loading Fields..."
				isLoading={fields.status === QueryStatus.LOADING}
				items={listItems}
				navigate={props.navigate}
			/>
		</>
	)
}