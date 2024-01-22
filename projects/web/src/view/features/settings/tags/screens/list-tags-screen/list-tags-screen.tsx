import { JPillButton } from "@ben-ryder/jigsaw-react";
import React, { useState } from "react";
import "./list-tags-screen.scss";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import { ErrorCallout } from "../../../../../patterns/components/error-callout/error-callout";
import {
  ContentManagerScreenProps
} from "../../../../../common/content-manager/content-manager";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {localful} from "../../../../../../state/athena-localful";
import {TagData, TagDto, TagEntity, TagVersion} from "../../../../../../state/schemas/tags/tags";

export function ListTagsScreen(props: ContentManagerScreenProps) {
  const [errors, setErrors] = useState<ErrorObject[]>([])

  const tags = useObservableQuery<TagDto[]>(localful.db<TagEntity, TagVersion, TagData, TagDto>('tags').observableGetAll())

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
