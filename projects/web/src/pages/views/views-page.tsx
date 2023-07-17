import { useLFBApplication } from "../../utils/lfb-context";
import React, { useMemo } from "react";
import { replaceParam, routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import { ContentList } from "../../patterns/components/content-list/content-list";
import { ContentItem } from "../../patterns/components/content-card/content-card";

export function ViewsPage() {
  const { document } = useLFBApplication();

  const viewContentItems: ContentItem[] = useMemo(() => {
    const views = document.views.content.ids.map(
      (id) => document.views.content.entities[id],
    );

    return views.map((view) => {
      const viewTags = view.tags.map(tagId => document.tags.content.entities[tagId]);

      return {
        id: view.id,
        name: view.name,
        url: replaceParam(routes.views.edit, ":id", view.id),
        tags: viewTags
      };
    });
  }, [document]);

  function onDelete(ids: string[]) {
    console.log(`deleting ${ids}`);
  }

  return (
    <>
      <Helmet>
        <title>Notes | Athena</title>
      </Helmet>
      <ContentList
        items={viewContentItems}
        title="Views"
        newUrl={routes.views.create}
        newText="New View"
        onDelete={onDelete}
      />
    </>
  );
}
