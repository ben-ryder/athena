import { TagForm } from "../tag-form/tag-form";
import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import { TagData } from "../../../../state/database/tags/tags";
import { TagsManagerNavigate } from "../tags-manager";
import { ApplicationError } from "../../../../state/actions";
import { db, EXAMPLE_VAULT_ID } from "../../../../state/storage/database";

export interface CreateTagPageProps {
  navigate: TagsManagerNavigate
}

export function CreateTagPage(props: CreateTagPageProps) {
  const [errors, setErrors] = useState<ApplicationError[]>([])

  async function onSave(data: TagData) {
    const res = await db.tagsHelper.createTag(data)
    props.navigate({page: "list"})
  }

  return (
    <>
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