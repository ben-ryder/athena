import { ItemForm } from "./item-form";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ItemContent, ItemDto } from "../../state/database/items/items";
import { ApplicationError } from "../../state/database/common/errors";
import { getItem } from "../../state/database/items/items.selectors";
import { deleteItem, updateItem } from "../../state/database/items/items.actions";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";

export function EditItemPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { document: db } = useLFBApplication();

  const [item, setItem] = useState<ItemDto | null>();
  const [error, setError] = useState<ApplicationError | null>(null)

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.items.list);
    }

    const item = getItem(db, params.id);
    if (!item) {
      setError({userMessage: "The item could not be found"});
      setItem(null);
    } else {
      setItem(item);
    }
  }, [db.items, setItem]);

  async function onSave(updatedItem: ItemContent) {
    if (!item) {
      return setError({userMessage: "Tried to save a item that isn't loaded yet."});
    }

    const res = await updateItem(db, item.id, updatedItem)
    if (res.success) {
      navigate(routes.items.list);
    }
    else {
      setError(res.error)
    }
  }

  async function onDelete() {
    if (!item) {
      return setError({userMessage: "Tried to delete a item that isn't loaded yet."});
    }

    const res = await deleteItem(db, item.id)
    if (res.success) {
      navigate(routes.items.list);
    }
    else {
      setError(res.error)
    }

    navigate(routes.items.list);
  }

  if (item) {
    return (
      <div>
        <Helmet>
          <title>{`${item.name} | Items | Athena`}</title>
        </Helmet>
        {error && <ErrorCallout error={error} />}
        <ItemForm
          itemContent={{
            name: item.name,
            body: item.body,
            tags: item.tags,
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return null;
}
