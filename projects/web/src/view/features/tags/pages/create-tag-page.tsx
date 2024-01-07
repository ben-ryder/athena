import { TagForm } from "../tag-form/tag-form";
import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/data/database/tags/tags";
import { createTag } from "../../../../state/data/database/tags/tags.thunks";
import { TagsManagerNavigate } from "../tags-manager";
import { ApplicationError } from "../../../../state/actions";

export interface CreateTagPageProps {
  navigate: TagsManagerNavigate
}

export function CreateTagPage(props: CreateTagPageProps) {
  const [errors, setErrors] = useState<ApplicationError[]>([])

  async function onSave(data: TagData) {
    const res = await createTag(data)
    if (res.success) {
      props.navigate({page: "list"})
    }
    else {
      setErrors(res.errors)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Note | Athena</title>
      </Helmet>
      {errors.length > 0 && <ErrorCallout errors={errors} />}
      <TagForm
        title="Create Tag"
        data={{ name: "", variant: null }}
        onSave={onSave}
        navigate={props.navigate}
      />
    </>
  );
}