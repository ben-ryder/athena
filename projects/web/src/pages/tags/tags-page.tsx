import { useLFBApplication } from "../../utils/lfb-context.js";
import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { TagEntity } from "../../state/features/tags/tags.types.js";
import { TagsList } from "../../patterns/components/tags-list/tags-list.js";
import { getAllTags } from "../../state/features/tags/tags.selectors.js";

export function TagsPage() {
  const { document } = useLFBApplication();

  const tags: TagEntity[] = useMemo(() => {
    return getAllTags(document)
  }, [document]);

  return (
    <>
      <Helmet>
        <title>Tags | Athena</title>
      </Helmet>

      <TagsList tags={tags} />
    </>
  );
}
