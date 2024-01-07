import { TagsList } from "./tags-list/tags-list";
import { store } from "../../../state/application-state";
import { selectAllTags } from "../../../state/data/database/tags/tags.selectors";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";
import { useState } from "react";
import { CreateTagPage } from "./pages/create-tag-page";
import { EditTagPage } from "./pages/edit-tag-page";
import { ApplicationErrorType } from "../../../state/actions";

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

  const state = store.getState()
  const tagsResult = selectAllTags(state)

  if (!tagsResult.success) {
    return (
      <ErrorCallout
        errors={[{
          type: ApplicationErrorType.UNEXPECTED,
          userMessage: tagsResult.errors.map(e => e.userMessage).join(",")
        }]}
      />
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
          tags={tagsResult.data}
          navigate={navigate}
        />
      </>
    )
  }
}