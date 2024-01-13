import { TagsList } from "./tags-list/tags-list";
import { useEffect, useState } from "react";
import { CreateTagPage } from "./pages/create-tag-page";
import { EditTagPage } from "./pages/edit-tag-page";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../state/storage/database";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../state/control-flow";
import { ErrorCallout } from "../../patterns/components/error-callout/error-callout";
import { TagDto } from "../../../state/database/tags/tags";

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

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tags, setTags] = useState<TagDto[]>([])

  useEffect(() => {
    async function getTags() {
      setIsLoading(true)
      const tags = await db.tagQueries.getAll()
      if (tags.success) {
        setTags(tags.data)
      }
      if (tags.errors) {
        setErrors(tags.errors)
      }
      setIsLoading(false)
    }
    getTags()
  }, [currentPage])


  if (isLoading) {
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
          tags={tags}
          navigate={navigate}
        />
      </>
    )
  }
}