import {JIcon, JPill, JButton} from "@ben-ryder/jigsaw-react";
import React from "react";
import { FrownIcon as NoContentIcon } from "lucide-react";
import "./tags-list.scss";
import {TagEntity} from "../../../state/data/current-vault/tags/tags";

export interface TagsListProps {
  tags: TagEntity[];
}

export function TagsList(props: TagsListProps) {
  return (
    <div className="ath-tags-list">
      <div className="ath-tags-list__header">
        <h2 className="ath-tags-list__heading">Tags</h2>
        <div className="ath-tags-list__actions">
          <JButton>
            New Tag
          </JButton>
        </div>
      </div>
      <div className="ath-tags-list__list">
        {props.tags.length === 0 && (
          <div className="ath-tags-list__emtpy-content">
            <JIcon variant="teal" size="xl">
              <NoContentIcon />
            </JIcon>
            <p>No Tags Found</p>
          </div>
        )}
        {props.tags.map((tag) => (
          <JPill
            key={tag.id}
            variant={tag.variant || undefined}
          >{tag.name}</JPill>
        ))}
      </div>
    </div>
  );
}
