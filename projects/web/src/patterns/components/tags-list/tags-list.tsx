import {TagEntity} from "../../../state/features/database/tag";
import {JBadge, JButtonLink, JIcon} from "@ben-ryder/jigsaw-react";
import {replaceParam, routes} from "../../../routes";
import {InternalLink} from "../internal-link";
import React from "react";
import {FrownIcon as NoContentIcon} from "lucide-react";
import "./tags-list.scss";

export interface TagsListProps {
	tags: TagEntity[]
}

export function TagsList(props: TagsListProps) {
	return (
		<div className="ath-tags-list">
			<div className="ath-tags-list__header">
				<h2 className="ath-tags-list__heading">Tags</h2>
				<div className="ath-tags-list__actions">
					<JButtonLink as={InternalLink} href={routes.organisation.tags.create}>New Tag</JButtonLink>
				</div>
			</div>
			<div className="ath-tags-list__list">
				{props.tags.length === 0 &&
					<div className="ath-tags-list__emtpy-content">
						<JIcon variant="teal" size="xl"><NoContentIcon/></JIcon>
						<p>No Tags Found</p>
					</div>
				}
				{props.tags.map(tag =>
					<JBadge
						key={tag.id}
						text={tag.name}
						href={replaceParam(routes.organisation.tags.edit, ":id", tag.id)}
						variant={tag.variant}
						linkAs={InternalLink}
					/>
				)}
			</div>
		</div>
	)
}
