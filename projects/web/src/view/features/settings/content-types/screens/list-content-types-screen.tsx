import { ContentManagerScreenProps } from "../../../../common/content-manager/content-manager";
import { AdminList, AdminListItemProps } from "../../../../patterns/layout/admin-list/admin-list";
import React, { useState } from "react";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { localful } from "../../../../../state/athena-localful";
import {
  ContentTypeData, ContentTypeDto,
  ContentTypeEntity,
  ContentTypeVersion
} from "../../../../../state/schemas/content-types/content-types";

export function ListContentTypesScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const contentTypes = useObservableQuery(localful.db<ContentTypeEntity, ContentTypeVersion, ContentTypeData, ContentTypeDto>('content_types').observableGetAll())

  const listItems: AdminListItemProps[] = contentTypes.status === QueryStatus.SUCCESS
    ? contentTypes.data.map(contentType => ({
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
        isLoading={contentTypes.status === QueryStatus.LOADING}
        items={listItems}
        navigate={props.navigate}
      />
    </>
  )
}