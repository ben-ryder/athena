import React, { useState } from "react";
import { TagForm } from "../forms/tag-form";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { TagData, TagDto, TagEntity, TagVersion } from "../../../../../state/schemas/tags/tags";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import {
  ContentManagerContentScreenProps,
} from "../../../../common/content-manager/content-manager";
import {localful} from "../../../../../state/athena-localful";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";


export function EditTagScreen(props: ContentManagerContentScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const tagResult = useObservableQuery(localful.db<TagEntity, TagVersion, TagData, TagDto>('tags').observableGet(props.id))

  async function onSave(updatedData: Partial<TagData>) {
    const res = await localful.db<TagEntity, TagVersion, TagData, TagDto>('tags').update(props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({screen: "list"})
    }
  }

  async function onDelete() {
    const res = await localful.db<TagEntity, TagVersion, TagData, TagDto>('tags').delete(props.id)
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
      {tagResult.status === QueryStatus.LOADING && (
        <p>Loading...</p>
      )}
      {tagResult.status === QueryStatus.SUCCESS &&
        <TagForm
          title={`Edit Tag '${tagResult.data.name}'`}
          data={{
            name: tagResult.data.name,
            colourVariant: tagResult.data.colourVariant,
          }}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
        />
      }
    </div>
  );
}