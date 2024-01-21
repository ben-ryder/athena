import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { db } from "../../../../../state/storage/database";
import { useLiveQuery } from "dexie-react-hooks";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../../../../localful/control-flow";
import {
  ContentManagerContentScreenProps,
} from "../../../../common/content-manager/content-manager";
import {ContentTypeForm} from "../forms/content-type-form";
import {ContentTypeData} from "../../../../../state/schemas/content-types/content-types";

export function EditContentTypeScreen(props: ContentManagerContentScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const contentTypeQuery = useLiveQuery(async () => {
    const query = await db.contentTypeQueries.get(props.id)
    if (query.success) {
      return {status: QueryStatus.SUCCESS, data: query.data, errors: query.errors}
    }
    return {status: QueryStatus.ERROR, errors: query.errors, data: null}
  }, [], QUERY_LOADING)

  async function onSave(updatedData: Partial<ContentTypeData>) {
    const res = await db.contentTypeQueries.update(props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    const res = await db.contentTypeQueries.delete(props.id)
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
          title={`Edit Content Type '${contentTypeQuery.data.name}'`}
          data={contentTypeQuery.data}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
        />
      }
    </div>
  );
}