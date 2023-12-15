import { ItemForm } from "./item-form";
import { VaultDatabase } from "../../state/database/database.types";
import { v4 as createUUID } from "uuid";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React from "react";
import { ItemContent } from "../../state/database/items/items";

export function CreateItemPage() {
  const navigate = useNavigate();
  const { makeChange } = useLFBApplication();

  async function onSave(newItem: ItemContent) {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    await makeChange((doc: VaultDatabase) => {
      doc.items.ids.push(id);
      doc.items.entities[id] = {
        id: id,
        name: newItem.name,
        body: newItem.body,
        tags: newItem.tags,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    });

    navigate(routes.items.list);
  }

  return (
    <>
      <Helmet>
        <title>Create Item | Athena</title>
      </Helmet>
      <ItemForm
        itemContent={{ name: "", body: "", tags: [] }}
        onSave={onSave}
      />
    </>
  );
}
