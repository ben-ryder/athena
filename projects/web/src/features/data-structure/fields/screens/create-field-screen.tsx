import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import {ErrorObject, ErrorTypes} from "@localful-athena/control-flow";
import {
  GenericManagerScreenProps
} from "../../../../common/generic-manager/generic-manager";
import { FieldDefinition } from "../../../../state/schemas/fields/fields";
import {FieldForm} from "../forms/field-form";
import { FIELD_TYPES } from "../../../../state/schemas/fields/field-types";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function CreateFieldScreen(props: GenericManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])
  const { currentDatabase } = useLocalful<DATA_SCHEMA>()

  async function onSave(data: FieldDefinition) {
    if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

    const res = await currentDatabase.create('fields', data)
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
      <FieldForm
        title="Create Field"
        data={{ label: "", type: FIELD_TYPES.markdown.identifier, required: true }}
        onSave={onSave}
        navigate={props.navigate}
        disableTypeEdit={false}
      />
    </>
  );
}
