import { ItemForm } from "./item-form";
import { VaultDatabase } from "../../state/database/database.types";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ItemContent, ItemEntity } from "../../state/database/items/items.types";

export function EditItemPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { makeChange, document } = useLFBApplication();

  const [item, setItem] = useState<ItemEntity | null>();
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.items.list);
    }

    const item = document.items.entities[params.id];
    if (!item) {
      setError("The item could not be found");
      setItem(null);
    } else {
      setItem(item);
    }
  }, [document, setItem]);

  async function onSave(updatedItem: ItemContent) {
    if (!item) {
      return setError("Tried to save a item that isn't loaded yet.");
    }

    await makeChange((doc: VaultDatabase) => {
      const timestamp = new Date().toISOString();

      // check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      if (doc.items.entities[item.id].name !== updatedItem.name) {
        doc.items.entities[item.id].name = updatedItem.name;
      }
      if (doc.items.entities[item.id].body !== updatedItem.body) {
        doc.items.entities[item.id].body = updatedItem.body;
      }

      // todo: don't think this works on arrays
      if (doc.items.entities[item.id].tags !== updatedItem.tags) {
        // todo: I should use not replace the array, but use push and deleteAt instead. ref https://automerge.org/docs/documents/lists/.
        doc.items.entities[item.id].tags = updatedItem.tags;
      }

      doc.items.entities[item.id].updatedAt = timestamp;
    });

    navigate(routes.items.list);
  }

  async function onDelete() {
    if (!item) {
      return setError("Tried to delete a item that isn't loaded yet.");
    }

    await makeChange((doc: VaultDatabase) => {
      doc.items.ids = doc.items.ids.filter(
        (id) => id !== item.id,
      );
      delete doc.items.entities[item.id];
    });

    navigate(routes.items.list);
  }

  if (item) {
    return (
      <div>
        <Helmet>
          <title>{`${item.name} | Items | Athena`}</title>
        </Helmet>
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
