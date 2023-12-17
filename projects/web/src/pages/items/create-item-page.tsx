import { ItemForm } from "./item-form";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { ItemContent } from "../../state/database/items/items";
import { createItem } from "../../state/database/items/items.actions";
import { ApplicationError } from "../../state/database/common/errors";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";

export function CreateItemPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<ApplicationError | null>(null)

  async function onSave(newItem: ItemContent) {
    const res = await createItem(newItem)

    if (res.success) {
      navigate(routes.items.list);
    }
    else {
      setError(res.error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Item | Athena</title>
      </Helmet>
      {error && <ErrorCallout error={error} />}
      <ItemForm
        itemContent={{ name: "", body: "", tags: [] }}
        onSave={onSave}
      />
    </>
  );
}
