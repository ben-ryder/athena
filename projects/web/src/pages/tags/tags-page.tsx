import { useLFBApplication } from "../../utils/lfb-context";
import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { TagEntity } from "../../state/database/tags/tags";
import { TagsList } from "../../patterns/components/tags-list/tags-list";
import { getAllTags } from "../../state/database/tags/tags.selectors";

export function TagsPage() {
  const { document: db } = useLFBApplication();

  const tags: TagEntity[] = useMemo(() => {
    return getAllTags(db)
  }, [db.tags]);

  return (
    <>
      <Helmet>
        <title>Tags | Athena</title>
      </Helmet>

      <TagsList tags={tags} />
    </>
  );
}
