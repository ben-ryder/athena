import { AthenaDatabase } from "../../state/features/database/athena-database";
import { v4 as createUUID } from "uuid";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React from "react";
import {
  ViewContent,
  ViewContentTypes,
  ViewOrderByFields,
  ViewOrderDirection
} from "../../state/features/database/views";
import { ViewForm } from "./view-form";

export function CreateViewPage() {
  const navigate = useNavigate();
  const { makeChange } = useLFBApplication();

  async function onSave(content: ViewContent) {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    await makeChange((doc: AthenaDatabase) => {
      doc.views.content.ids.push(id);
      doc.views.content.entities[id] = {
        id: id,
        name: content.name,
        contentType: content.contentType,
        tags: content.tags,
        orderBy: content.orderBy,
        orderDirection: content.orderDirection,
        limit: content.limit,
        updatedAt: timestamp,
        createdAt: timestamp,
      };
    });

    navigate(routes.views.list);
  }

  return (
    <>
      <Helmet>
        <title>Create View | Athena</title>
      </Helmet>
      <ViewForm
        content={{
          name: "",
          contentType: ViewContentTypes.NOTES,
          tags: [],
          orderBy: ViewOrderByFields.UPDATED_AT,
          orderDirection: ViewOrderDirection.DESC,
          limit: 0,
        }}
        onSave={onSave}
      />
    </>
  );
}
