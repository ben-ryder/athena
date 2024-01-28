import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject } from "@localful-athena/control-flow";
import {
  ContentManagerScreenProps
} from "../../../../common/content-manager/content-manager";
import {
  ContentTypeData
} from "../../../../../state/schemas/content-types/content-types";
import {ContentTypeForm} from "../forms/content-type-form";
import { localful } from "../../../../../state/athena-localful";

export function CreateContentTypeScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: ContentTypeData) {
    const res = await localful.db.create('content_types', data)
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
