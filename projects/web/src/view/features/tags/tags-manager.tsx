import { TagsList } from "./tags-list/tags-list";
import { useState } from "react";
import { CreateTagPage } from "./pages/create-tag-page";
import { EditTagPage } from "./pages/edit-tag-page";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../state/database";
import { ActionStatus, LOADING_STATUS } from "../../../state/actions";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";

export type TagsManagerPages = {
  page: "list"
} | {
  page: "new"
} | {
  page: "edit",
  id: string
}
export type TagsManagerNavigate = (page: TagsManagerPages) => void

export function TagsManager() {
  const [currentPage, navigate] = useState<TagsManagerPages>({page: "list"})
  const tags = useLiveQuery(db.tagsHelper.getTags, [], LOADING_STATUS)

  if (tags.status === ActionStatus.LOADING) {
    return (
      <p>Loading...</p>
    )
  }
  if (tags.status === ActionStatus.ERROR) {
    return (
      <ErrorCallout errors={tags.errors} />
    )
  }

  if (currentPage.page === 'new') {
    return (
      <>
        <CreateTagPage
          navigate={navigate}
        />
      </>
    )
  }
  else if (currentPage.page === 'edit') {
    return (
      <>
        <EditTagPage
          id={currentPage.id}
          navigate={navigate}
        />
      </>
    )
  }
  else {
    return (
      <>
        <TagsList
          tags={tags.data}
          navigate={navigate}
        />
      </>
    )
  }
}