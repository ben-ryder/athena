import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "@localful-athena/control-flow";
import {
  ContentManagerContentScreenProps,
} from "../../../../common/content-manager/content-manager";
import { FieldForm } from "../forms/field-form";
import { FieldDefinition, FieldDto, FieldEntity, FieldVersion } from "../../../../../state/schemas/fields/fields";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { localful } from "../../../../../state/athena-localful";

export function EditFieldScreen(props: ContentManagerContentScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const fieldQuery = useObservableQuery(localful.db<FieldEntity, FieldVersion, FieldDefinition, FieldDto>('fields').observableGet(props.id))

  async function onSave(updatedData: Partial<FieldDefinition>) {
    const res = await localful.db<FieldEntity, FieldVersion, FieldDefinition, FieldDto>('fields').update(props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    const res = await localful.db<FieldEntity, FieldVersion, FieldDefinition, FieldDto>('fields').delete(props.id)
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