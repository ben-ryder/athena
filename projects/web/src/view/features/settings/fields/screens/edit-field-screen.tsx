import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import {
  GenericManagerContentScreenProps,
} from "../../../../common/generic-manager/generic-manager";
import { FieldForm } from "../forms/field-form";
import { FieldDefinition} from "../../../../../state/schemas/fields/fields";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { localful } from "../../../../../state/athena-localful";

export function EditFieldScreen(props: GenericManagerContentScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const fieldQuery = useObservableQuery(localful.db.observableGet('fields', props.id))

  async function onSave(updatedData: Partial<FieldDefinition>) {
    const res = await localful.db.update('fields', props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    const res = await localful.db.delete('fields', props.id)
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
          title={`Edit Field '${fieldQuery.data.data.label}'`}
          data={fieldQuery.data.data}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
          disableTypeEdit={true}
        />
      }
    </div>
  );
}