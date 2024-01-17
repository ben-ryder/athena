import { ContentManagerScreenProps } from "../../../../common/content-manager/content-manager";
import { AdminList, AdminListItemProps } from "../../../../patterns/layout/admin-list/admin-list";
import React, { useState } from "react";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../../../state/control-flow";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../../../state/storage/database";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";

export function ListFieldsScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const fields = useLiveQuery(async () => {
    const result = await db.fieldQueries.getAll()
    if (result.success) {
      return {status: QueryStatus.SUCCESS, data: result.data}
    }
    if (result.errors) {
      setErrors(result.errors)
    }
    return {status: QueryStatus.ERROR, errors: result.errors, data: null}
  }, [], QUERY_LOADING)

  const listItems: AdminListItemProps[] = fields.status === QueryStatus.SUCCESS
    ? fields.data.map(field => ({
      id: field.id,
      title: field.label,
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