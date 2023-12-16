import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TagContent, TagEntity } from "../../state/database/tags/tags";
import { TagForm } from "./tag-form/tag-form";
import { deleteTag, updateTag } from "../../state/database/tags/tags.actions";
import { getTag } from "../../state/database/tags/tags.selectors";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";
import { ApplicationError } from "../../state/database/common/errors";

export function EditTagPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { document } = useLFBApplication();

  const [tag, setTag] = useState<TagEntity | null>();
  const [error, setError] = useState<ApplicationError | null>(null);

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.tags.list);
    }

    const tag = getTag(document, params.id);
    if (!tag) {
      setError({
        userMessage: "The tag could not be found"
      });
      setTag(null);
    }
    else {
      setTag(tag);
    }
  }, [document, setTag]);

  async function onSave(updatedContent: Partial<TagContent>) {
    if (!tag) {
      return setError({
        userMessage: "Tried to save a tag that isn't loaded yet."
      });
    }

    const res =  await updateTag(document, tag.id, updatedContent)
    if (res.success) {
      navigate(routes.tags.list);
    }
    else {
      setError(res.error)
    }
  }

  async function onDelete() {
    if (!tag) {
      return setError({
        userMessage: "Tried to delete a tag that isn't loaded yet."
      });
    }

    const res =  await deleteTag(document, tag.id)
    if (res.success) {
      navigate(routes.tags.list);
    }
    else {
      setError(res.error)
    }
  }

  return (
    <div>
      <Helmet>
        <title>{`${tag?.name || "Edit"} | Tags | Athena`}</title>
      </Helmet>
      {error && <ErrorCallout error={error} />}
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
    </div>
  );
}
