import React, {useState} from "react";
import {ErrorCallout} from "../../../../patterns/components/error-callout/error-callout";
import {ErrorObject, ErrorTypes, QueryStatus} from "@localful-athena/control-flow";
import {GenericManagerContentScreenProps,} from "../../../../common/generic-manager/generic-manager";
import {FieldForm} from "../forms/field-form";
import {FieldDefinition} from "../../../../state/schemas/fields/fields";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function EditFieldScreen(props: GenericManagerContentScreenProps) {
  const {currentDatabase} = useLocalful<DATA_SCHEMA>()
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const fieldQuery = useObservableQuery(currentDatabase?.liveGet('fields', props.id))

  async function onSave(updatedData: Partial<FieldDefinition>) {
    if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

    const res = await currentDatabase.update('fields', props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

    const res = await currentDatabase.delete('fields', props.id)
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