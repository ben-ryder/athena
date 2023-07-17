import { AthenaDatabase } from "../../state/features/database/athena-database";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ViewContent,
  ViewEntity,
} from "../../state/features/database/views";
import { ViewForm } from "./view-form";

export function EditViewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { makeChange, document } = useLFBApplication();

  const [view, setView] = useState<ViewEntity | null>();
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.views.list);
    }

    const view = document.views.content.entities[params.id];
    if (!view) {
      setError("The view could not be found");
      setView(null);
    } else {
      setView(view);
    }
  }, [document, setView]);

  async function onSave(updatedContent: ViewContent) {
    if (!view) {
      return setError("Tried to save a view that isn't loaded yet.");
    }

    await makeChange((doc: AthenaDatabase) => {
      const timestamp = new Date().toISOString();

      doc.views.content.entities[view.id] = {
        ...doc.views.content.entities[view.id],
        ...updatedContent,
        updatedAt: timestamp
      }
    });

    navigate(routes.views.list);
  }

  async function onDelete() {
    if (!view) {
      return setError("Tried to delete a view that isn't loaded yet.");
    }

    await makeChange((doc: AthenaDatabase) => {
      doc.views.content.ids = doc.views.content.ids.filter(
        (id) => id !== view.id,
      );
      delete doc.views.content.entities[view.id];
    });

    navigate(routes.views.list);
  }

  if (view) {
    return (
      <div>
        <Helmet>
          <title>{`${view.name} | Views | Athena`}</title>
        </Helmet>
        <ViewForm
          content={{
            name: view.name,
            contentType: view.contentType,
            tags: view.tags,
            orderBy: view.orderBy,
            orderDirection: view.orderDirection,
            limit: view.limit,
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return null;
}
