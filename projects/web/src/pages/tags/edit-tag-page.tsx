import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TagContent, TagEntity } from "../../state/features/tags/tags.types";
import { TagForm } from "./tag-form/tag-form";
import { JCallout } from "@ben-ryder/jigsaw-react";
import { deleteTag, updateTag } from "../../state/features/tags/tags.actions";
import { getTag } from "../../state/features/tags/tags.selectors";

export function EditTagPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { document } = useLFBApplication();

  const [tag, setTag] = useState<TagEntity | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.tags.list);
    }

    const tag = getTag(document, params.id);
    if (!tag) {
      setError("The tag could not be found");
      setTag(null);
    }
    else {
      setTag(tag);
    }
  }, [document, setTag]);

  async function onSave(updatedContent: Partial<TagContent>) {
    if (!tag) {
      return setError("Tried to save a tag that isn't loaded yet.");
    }

    const res =  await updateTag(tag.id, updatedContent)
    if (res.success) {
      navigate(routes.tags.list);
    }
    else {
      setError(res.errorMessage)
    }
  }

  async function onDelete() {
    if (!tag) {
      return setError("Tried to delete a tag that isn't loaded yet.");
    }

    const res =  await deleteTag(tag.id)
    if (res.success) {
      navigate(routes.tags.list);
    }
    else {
      setError(res.errorMessage)
    }
  }

  return (
    <div>
      <Helmet>
        <title>{`${tag?.name || "Edit"} | Tags | Athena`}</title>
      </Helmet>
      {error && <JCallout variant="critical">{error}</JCallout> }
      {tag &&
        <TagForm
          content={{
            name: tag.name,
            variant: tag.variant,
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      }
      {error}
    </div>
  );
}
