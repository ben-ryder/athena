import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject } from "../../../../../state/control-flow";
import { db } from "../../../../../state/storage/database";
import {
  ContentManagerScreenProps
} from "../../../../common/content-manager/content-manager";
import {ContentTypeData} from "../../../../../state/schemas/content-types/content-types";
import {ContentTypeForm} from "../forms/content-type-form";

export function CreateContentTypeScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: ContentTypeData) {
    const res = await db.contentTypeQueries.create(data)
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
