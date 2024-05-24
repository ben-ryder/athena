import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject } from "@localful-athena/control-flow";
import {
  GenericManagerScreenProps
} from "../../../../common/generic-manager/generic-manager";
import { FieldDefinition } from "../../../../state/schemas/fields/fields";
import {FieldForm} from "../forms/field-form";
import { FIELD_TYPES } from "../../../../state/schemas/fields/field-types";
import { localful } from "../../../../state/athena-localful";

export function CreateFieldScreen(props: GenericManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: FieldDefinition) {
    const res = await localful.db.create('fields', data)
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
