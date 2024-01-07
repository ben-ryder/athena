import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TagForm } from "../tag-form/tag-form";
import { ErrorCallout } from "../../../patterns/components/error-callout/error-callout";
import { ApplicationError } from "../../../../state/actions";
import { store } from "../../../../state/application-state";
import { TagData, TagDto } from "../../../../state/data/database/tags/tags";
import { selectTag } from "../../../../state/data/database/tags/tags.selectors";
import { deleteTag, updateTag } from "../../../../state/data/database/tags/tags.thunks";
import { TagsManagerNavigate } from "../tags-manager";

export interface EditTagPageProps {
  id: string,
  navigate: TagsManagerNavigate
}

export function EditTagPage(props: EditTagPageProps) {
  const state = store.getState();
  const [tag, setTag] = useState<TagDto | null>();
  const [errors, setErrors] = useState<ApplicationError[]>([])

  useEffect(() => {
    // Reset error
    setErrors([]);

    const tagResult = selectTag(state, props.id);
    if (tagResult.success) {
      setTag(tagResult.data)
    }
    else {
      setErrors(tagResult.errors);
      setTag(null);
    }
  }, [state, setTag]);

  async function onSave(updatedData: Partial<TagData>) {
    if (!tag) {
      return;
    }

    const res = await updateTag(tag.id, updatedData)
    if (res.success) {
      props.navigate({page: "list"});
    }
    else {
      setErrors(res.errors)
    }
  }

  async function onDelete() {
    if (!tag) {
      return;
    }

    const res =  await deleteTag(tag.id)
    if (res.success) {
      props.navigate({page: "list"});
    }
    else {
      setErrors(res.errors)
    }
  }

  return (
    <div>
      <Helmet>
        <title>{`${tag?.name || "Edit"} | Tags | Athena`}</title>
      </Helmet>
      {errors.length > 0 && <ErrorCallout errors={errors} />}
      {tag &&
        <TagForm
          title={`Edit Tag ${tag?.name}`}
          data={{
            name: tag.name,
            variant: tag.variant,
          }}
          onSave={onSave}
          onDelete={onDelete}
          navigate={props.navigate}
        />
      }
    </div>
  );
}