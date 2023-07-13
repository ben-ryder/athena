import {useLFBApplication} from "../../utils/lfb-context";
import React, {useMemo} from "react";
import {Helmet} from "react-helmet-async";
import {TagEntity} from "../../state/features/database/tag";
import {TagsList} from "../../patterns/components/tags-list/tags-list";

export function TagsPage() {
  const {document} = useLFBApplication();

  const tags: TagEntity[] = useMemo(() => {
    return document.tags.content.ids.map(id => document.tags.content.entities[id]);
  }, [document]);

  function onDelete(ids: string[]) {
    console.log(`deleting ${ids}`);
  }

  return (
    <>
      <Helmet>
        <title>Tags | Athena</title>
      </Helmet>

      <TagsList tags={tags} />
    </>
  )
}
