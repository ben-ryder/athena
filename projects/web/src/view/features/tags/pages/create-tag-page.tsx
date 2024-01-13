import { TagForm } from "../tag-form/tag-form";
import React, { useState } from "react";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/database/tags/tags";
import { TagsManagerNavigate } from "../tags-manager";
import { ErrorObject } from "../../../../state/control-flow";
import { db } from "../../../../state/storage/database";

export interface CreateTagPageProps {
  navigate: TagsManagerNavigate
}

export function CreateTagPage(props: CreateTagPageProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  async function onSave(data: TagData) {
    const res = await db.tagQueries.create(data)
    props.navigate({page: "list"})
  }

  return (
    <>
      {errors.length > 0 && <ErrorCallout errors={errors} />}
      <TagForm
        title="Create Tag"
        data={{ name: "", colourVariant: undefined }}
        onSave={onSave}
        navigate={props.navigate}
      />
    </>
  );
}