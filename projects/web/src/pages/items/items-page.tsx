import { useLFBApplication } from "../../utils/lfb-context";
import React, { useMemo } from "react";
import { replaceParam, routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import { ContentList } from "../../patterns/components/content-list/content-list";
import { ContentItem } from "../../patterns/components/content-card/content-card";

export function ItemsPage() {
  const { document } = useLFBApplication();

  const ItemContentItems: ContentItem[] = useMemo(() => {
    const items = document.items.ids.map(
      (id) => document.items.entities[id],
    );

    return items.map((item) => {
      const itemTags = item.tags.map(tagId => document.tags.entities[tagId]);

      return {
        id: item.id,
        name: item.name,
        teaser: item.body.length > 0 ? item.body.substring(0, 100) : null,
        url: replaceParam(routes.items.edit, ":id", item.id),
        tags: itemTags
      };
    });
  }, [document]);

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
