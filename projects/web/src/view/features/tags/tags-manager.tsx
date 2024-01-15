import { TagsList } from "./tags-list/tags-list";
import { useState } from "react";
import { CreateTagPage } from "./pages/create-tag-page";
import { EditTagPage } from "./pages/edit-tag-page";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../state/storage/database";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../state/control-flow";
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
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const tags = useLiveQuery(async () => {
    const tags = await db.tagQueries.getAll()
    if (tags.success) {
      return {status: QueryStatus.SUCCESS, data: tags.data}
    }
    if (tags.errors) {
      setErrors(tags.errors)
    }
    return {status: QueryStatus.ERROR, errors: tags.errors, data: null}
  }, [], QUERY_LOADING)

  if (tags.status === QueryStatus.LOADING) {
    return (
      <p>Loading...</p>
    )
  }

  if (currentPage.page === 'new') {
    return (
      <>
        {errors.length > 0 && <ErrorCallout errors={errors} />}
        <CreateTagPage
          navigate={navigate}
        />
      </>
    )
  }
  else if (currentPage.page === 'edit') {
    return (
      <>
        {errors.length > 0 && <ErrorCallout errors={errors} />}
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
        {errors.length > 0 && <ErrorCallout errors={errors} />}
        <TagsList
          tags={tags.data || []}
          navigate={navigate}
        />
      </>
    )
  }
}