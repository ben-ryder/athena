import { TagForm } from "./tag-form/tag-form";
import { v4 as createUUID } from "uuid";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { TagContent } from "../../state/database/tags/tags";
import { createTag } from "../../state/database/tags/tags.actions";
import { ApplicationError } from "../../state/database/common/errors";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";

export function CreateTagPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<ApplicationError | null>(null)

  async function onSave(content: TagContent) {
    const res = await createTag(content)

    if (res.success) {
      navigate(routes.tags.list);
    }
    else {
      setError(res.error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Note | Athena</title>
      </Helmet>
      {error && <ErrorCallout error={error} />}
      <TagForm content={{ name: "", variant: null }} onSave={onSave} />
    </>
  );
}
