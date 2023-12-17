import { useLFBApplication } from "../../utils/lfb-context";
import React, { useMemo } from "react";
import { replaceParam, routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import { ContentList } from "../../patterns/components/content-list/content-list";
import { ContentItem } from "../../patterns/components/content-card/content-card";
import { getAllItems } from "../../state/database/items/items.selectors";

export function ItemsPage() {
  const { document: db } = useLFBApplication();

  const ItemContentItems: ContentItem[] = useMemo(() => {
    return getAllItems(db).map(item => ({
      id: item.id,
      name: item.name,
      teaser: item.body.substring(0, 100),
      url: replaceParam(routes.items.edit, ":id", item.id),
      tags: item.tagEntities
    }))
  }, [db.items, db.tags]);

  function onDelete(ids: string[]) {
    console.log(`deleting ${ids}`);
  }

  return (
    <>
      <Helmet>
        <title>Items | Athena</title>
      </Helmet>
      <ContentList
        items={ItemContentItems}
        title="Items"
        newUrl={routes.items.create}
        newText="New Item"
        onDelete={onDelete}
      />
    </>
  );
}
