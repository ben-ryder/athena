import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import {ErrorObject, ErrorTypes} from "@localful-athena/control-flow";
import {
  GenericManagerScreenProps
} from "../../../../common/generic-manager/generic-manager";
import {
  ContentTypeData
} from "../../../../state/schemas/content-types/content-types";
import {ContentTypeForm} from "../forms/content-type-form";
import {DATA_SCHEMA} from "../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function CreateContentTypeScreen(props: GenericManagerScreenProps) {
  const {currentDatabase} = useLocalful<DATA_SCHEMA>()
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: ContentTypeData) {
    if (!currentDatabase) return setErrors([{type: ErrorTypes.NO_CURRENT_DATABASE}])

    const res = await currentDatabase.create('content_types', data)
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
      <ContentTypeForm
        title="Create Content Type"
        data={{ name: "", fields: [] }}
        onSave={onSave}
        navigate={props.navigate}
      />
    </>
  );
}
