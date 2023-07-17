import { TagForm } from "./tag-form/tag-form";
import { AthenaDatabase } from "../../state/features/database/athena-database";
import { v4 as createUUID } from "uuid";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React from "react";
import { TagContent, TagEntity } from "../../state/features/database/tag";

export function CreateTagPage() {
  const navigate = useNavigate();
  const { makeChange } = useLFBApplication();

  async function onSave(content: TagContent) {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    await makeChange((doc: AthenaDatabase) => {
      doc.tags.content.ids.push(id);
      const entity: TagEntity = {
        id: id,
        name: content.name,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      // automerge doesn't support explicit undefined values, so only include the data if required
      if (content.variant) {
        entity.variant = content.variant;
      }

      doc.tags.content.entities[id] = entity;
    });

    navigate(routes.tags.list);
  }

  return (
    <>
      <Helmet>
        <title>Create Note | Athena</title>
      </Helmet>
      <TagForm content={{ name: "" }} onSave={onSave} />
    </>
  );
}
