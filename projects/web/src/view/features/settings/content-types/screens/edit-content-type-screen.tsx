import React, { useState } from "react";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import {
  GenericManagerContentScreenProps,
} from "../../../../common/generic-manager/generic-manager";
import {ContentTypeForm} from "../forms/content-type-form";
import {
  ContentTypeData
} from "../../../../../state/schemas/content-types/content-types";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { localful } from "../../../../../state/athena-localful";

export function EditContentTypeScreen(props: GenericManagerContentScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const contentTypeQuery = useObservableQuery(localful.db.observableGet('content_types', props.id))

  async function onSave(updatedData: Partial<ContentTypeData>) {
    const res = await localful.db.update("content_types", props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    const res = await localful.db.delete('content_types', props.id)
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
      {contentTypeQuery.status === QueryStatus.LOADING && (
        <p>Loading...</p>
      )}
      {contentTypeQuery.status === QueryStatus.SUCCESS &&
        <ContentTypeForm
          title={`Edit Content Type '${contentTypeQuery.data.data.name}'`}
          data={contentTypeQuery.data.data}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
        />
      }
    </div>
  );
}