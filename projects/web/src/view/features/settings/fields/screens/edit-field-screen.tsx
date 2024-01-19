import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { db } from "../../../../../state/storage/database";
import { useLiveQuery } from "dexie-react-hooks";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../../../state/control-flow";
import {
  ContentManagerContentScreenProps,
} from "../../../../common/content-manager/content-manager";
import { FieldForm } from "../forms/field-form";
import { FieldDefinition } from "../../../../../state/schemas/fields/fields";

export function EditFieldScreen(props: ContentManagerContentScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const fieldQuery = useLiveQuery(async () => {
    const query = await db.fieldQueries.get(props.id)
    if (query.success) {
      return {status: QueryStatus.SUCCESS, data: query.data, errors: query.errors}
    }
    return {status: QueryStatus.ERROR, errors: query.errors, data: null}
  }, [], QUERY_LOADING)

  async function onSave(updatedData: Partial<FieldDefinition>) {
    const res = await db.fieldQueries.update(props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    const res = await db.fieldQueries.delete(props.id)
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
      {fieldQuery.status === QueryStatus.LOADING && (
        <p>Loading...</p>
      )}
      {fieldQuery.status === QueryStatus.SUCCESS &&
        <FieldForm
          title={`Edit Field '${fieldQuery.data.label}'`}
          data={fieldQuery.data}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
          disableTypeEdit={true}
        />
      }
    </div>
  );
}