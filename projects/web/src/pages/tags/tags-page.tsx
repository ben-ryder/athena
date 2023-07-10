import {useLFBApplication} from "../../utils/lfb-context";
import React, {useMemo} from "react";
import {replaceParam, routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {ContentList} from "../../patterns/layout/content-list/content-list";
import {ContentItem} from "../../patterns/layout/content-card/content-card";

export function TagsPage() {
  const {document} = useLFBApplication();

  const tagContentItems: ContentItem[] = useMemo(() => {
    const tags = document.tags.content.ids.map(id => document.tags.content.entities[id]);

    return tags.map(tag => {
      return {
        id: tag.id,
        name: tag.name,
        url: replaceParam(routes.organisation.tags.edit, ":id", tag.id)
      }
    })
  }, [document]);

  function onDelete(ids: string[]) {
    console.log(`deleting ${ids}`);
  }

  return (
    <>
      <Helmet>
        <title>Tags | Athena</title>
      </Helmet>
      <ContentList
        items={tagContentItems}
        title="Tags"
        newUrl={routes.organisation.tags.create}
        newText="New Tag"
        onDelete={onDelete}
      />
    </>
  )
}
