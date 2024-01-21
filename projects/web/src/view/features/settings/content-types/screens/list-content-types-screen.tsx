import { ContentManagerScreenProps } from "../../../../common/content-manager/content-manager";
import { AdminList, AdminListItemProps } from "../../../../patterns/layout/admin-list/admin-list";
import React, { useState } from "react";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../../../../localful/control-flow";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../../../state/storage/database";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";

export function ListContentTypesScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const contentType = useLiveQuery(async () => {
    const result = await db.contentTypeQueries.getAll()
    if (result.success) {
      return {status: QueryStatus.SUCCESS, data: result.data}
    }
    if (result.errors) {
      setErrors(result.errors)
    }
    return {status: QueryStatus.ERROR, errors: result.errors, data: null}
  }, [], QUERY_LOADING)

  const listItems: AdminListItemProps[] = contentType.status === QueryStatus.SUCCESS
    ? contentType.data.map(contentType => ({
      id: contentType.id,
      title: contentType.name,
      description: `desc: ${contentType.description} | entity: ${contentType.id} | version: ${contentType.versionId} | created: ${contentType.createdAt} | updated: ${contentType.updatedAt}`,
      navigate: props.navigate
    }))
    : []

  return (
    <>
      {errors.length > 0 && <ErrorCallout errors={errors} />}
      <AdminList
        title="Content Types"
        description="Content types ."
        addNewText="New Content Type"
        noItemsText="No Content Types"
        loadingText="Loading Content Types..."
        isLoading={contentType.status === QueryStatus.LOADING}
        items={listItems}
        navigate={props.navigate}
      />
    </>
  )
}