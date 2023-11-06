import { TagForm } from "./tag-form/tag-form";
import { AthenaDatabase } from "../../state/athena-database";
import { v4 as createUUID } from "uuid";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { TagContent, TagEntity } from "../../state/features/tags/tags.types";
import { createTag } from "../../state/features/tags/tags.actions";
import { JCallout } from "@ben-ryder/jigsaw-react";

export function CreateTagPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null)

  async function onSave(content: TagContent) {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    const res = await createTag({
      id: id,
      name: content.name,
      variant: content.variant,
      createdAt: timestamp,
      updatedAt: timestamp
    })

    if (res.success) {
      navigate(routes.tags.list);
    }
    else {
      setError(res.errorMessage)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Note | Athena</title>
      </Helmet>
      {error && <JCallout variant="danger">{error}</JCallout>}
      <TagForm content={{ name: "", variant: null }} onSave={onSave} />
    </>
  );
}
