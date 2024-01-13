import { JPillButton } from "@ben-ryder/jigsaw-react";
import React from "react";
import "./tags-list.scss";
import { TagDto } from "../../../../state/database/tags/tags";
import { TagsManagerNavigate } from "../tags-manager";

export interface TagsListProps {
  tags: TagDto[];
  navigate: TagsManagerNavigate
}

export function TagsList(props: TagsListProps) {
  return (
    <div className="tags-list">
      <div className="tags-list__list">
        <JPillButton
          onClick={() => {
            props.navigate({page: "new"})
          }}
          style={{fontWeight: "bold"}}
        >
          Create New Tag
        </JPillButton>
        {props.tags.map((tag) => (
          <JPillButton
            onClick={() => {
              props.navigate({page: "edit", id: tag.id})
            }}
            key={tag.id}
            variant={tag.colourVariant || undefined}
          >{tag.name}</JPillButton>
        ))}
      </div>
    </div>
  );
}
