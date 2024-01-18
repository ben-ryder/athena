import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject } from "../../../../../state/control-flow";
import { db } from "../../../../../state/storage/database";
import {
  ContentManagerScreenProps
} from "../../../../common/content-manager/content-manager";
import {FieldDefinition, FieldTypes} from "../../../../../state/schemas/fields/fields";
import {FieldForm} from "./field-form";

export function CreateFieldScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: FieldDefinition) {
    const res = await db.fieldQueries.create(data)
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
        data={{ label: "", type: FieldTypes.TEXT_SHORT, required: true }}
        onSave={onSave}
        navigate={props.navigate}
      />
    </>
  );
}
