import { JPillButton } from "@ben-ryder/jigsaw-react";
import React, { useState } from "react";
import "./list-tags-screen.scss";
import { ErrorObject, QUERY_LOADING, QueryStatus } from "../../../../../../../localful/control-flow";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../../../../state/storage/database";
import { ErrorCallout } from "../../../../../patterns/components/error-callout/error-callout";
import {
  ContentManagerScreenProps
} from "../../../../../common/content-manager/content-manager";

export function ListTagsScreen(props: ContentManagerScreenProps) {
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

  return (
    <>
      <div className="tags-list">
        {errors.length > 0 && <ErrorCallout errors={errors} />}
        <div className="tags-list__list">
          <JPillButton
            onClick={() => {
              props.navigate({screen: "new"})
            }}
            style={{fontWeight: "bold"}}
          >
            Create New Tag
          </JPillButton>
          {tags.status === QueryStatus.SUCCESS && tags.data.map((tag) => (
            <JPillButton
              onClick={() => {
                props.navigate({screen: "edit", id: tag.id})
              }}
              key={tag.id}
              variant={tag.colourVariant || undefined}
            >{tag.name}</JPillButton>
          ))}
        </div>
      </div>
    </>
  );
}
