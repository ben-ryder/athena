import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject } from "@localful-athena/control-flow";
import {
  ContentManagerScreenProps
} from "../../../../common/content-manager/content-manager";
import { FieldDefinition, FieldDto, FieldEntity, FieldVersion } from "../../../../../state/schemas/fields/fields";
import {FieldForm} from "../forms/field-form";
import { FIELD_TYPES } from "../../../../../state/schemas/fields/field-types";
import { localful } from "../../../../../state/athena-localful";

export function CreateFieldScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: FieldDefinition) {
    const res = await localful.db<FieldEntity, FieldVersion, FieldDefinition, FieldDto>('fields').create(data)
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
        data={{ label: "", type: FIELD_TYPES.textShort.identifier, required: true }}
        onSave={onSave}
        navigate={props.navigate}
        disableTypeEdit={false}
      />
    </>
  );
}
