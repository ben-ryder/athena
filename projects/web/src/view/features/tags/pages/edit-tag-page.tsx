import React, { useState } from "react";
import { TagForm } from "../tag-form/tag-form";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/database/tags/tags";
import { TagsManagerNavigate } from "../tags-manager";
import { db } from "../../../../state/storage/database";
import { useLiveQuery } from "dexie-react-hooks";
import { ErrorObject, QUERY_LOADING, QueryResult, QueryStatus } from "../../../../state/control-flow";

export interface EditTagPageProps {
  id: string,
  navigate: TagsManagerNavigate
}

export function EditTagPage(props: EditTagPageProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const tagResult = useLiveQuery(async () => {
    const tag = await db.tagQueries.get(props.id)
    if (tag.success) {
      return {status: QueryStatus.SUCCESS, data: tag.data, errors: tag.errors}
    }
    return {status: QueryStatus.ERROR, errors: tag.errors, data: null}
  }, [], QUERY_LOADING)

  async function onSave(updatedData: Partial<TagData>) {
    const res = await db.tagQueries.update(props.id, updatedData)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({page: "list"})
    }
  }

  async function onDelete() {
    const res = await db.tagQueries.delete(props.id)
    if (!res.success) {
      setErrors(res.errors)
    }
    else {
      props.navigate({page: "list"})
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