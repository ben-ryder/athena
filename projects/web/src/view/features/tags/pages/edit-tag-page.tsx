import React, { useState } from "react";
import { TagForm } from "../tag-form/tag-form";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import { ActionStatus, ApplicationError, LOADING_STATUS } from "../../../../state/actions";
import { TagData } from "../../../../state/database/tags/tags";
import { TagsManagerNavigate } from "../tags-manager";
import { db } from "../../../../state/database";
import { useLiveQuery } from "dexie-react-hooks";

export interface EditTagPageProps {
  id: string,
  navigate: TagsManagerNavigate
}

export function EditTagPage(props: EditTagPageProps) {
  const [errors, setErrors] = useState<ApplicationError[]>([])
  const tag = useLiveQuery(db.createGetTagQuery(props.id), [], LOADING_STATUS)

  async function onSave(updatedData: Partial<TagData>) {
    const res = await db.updateTag(props.id, updatedData)
    props.navigate({page: "list"})
  }

  async function onDelete() {
    const res = await db.deleteTag(props.id)
    props.navigate({page: "list"})
  }

  if (tag.status === ActionStatus.LOADING) {
    return (
      <p>Loading...</p>
    )
  }
  if (tag.status === ActionStatus.ERROR) {
    return (
      <ErrorCallout errors={tag.errors} />
    )
  }

  return (
    <div>
      {errors.length > 0 && <ErrorCallout errors={errors} />}
      {tag &&
        <TagForm
          title={`Edit Tag '${tag.data.name}'`}
          data={{
            name: tag.data.name,
            variant: tag.data.variant,
          }}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
        />
      }
    </div>
  );
}