import "./content-card.scss";
import { Link } from "react-router-dom";
import { TagEntity } from "../../../state/features/tags/tags.types";
import { JBadge } from "@ben-ryder/jigsaw-react";
import { routes } from "../../../routes";
import { InternalLink } from "../internal-link";

export interface ContentItem {
  id: string;
  name: string;
  teaser?: string;
  url: string;
  tags?: TagEntity[]
}

export interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard(props: ContentCardProps) {
  return (
    <div className="ath-content-card">
      <div className="ath-content-card__content">
        <Link className="ath-content-card__link" to={props.item.url}>
          <span className="j-hidden">{`go to ${props.item.name}`}</span>
        </Link>
        <h3 className="ath-content-card__name">{props.item.name}</h3>
        {props.item.teaser && (
          <p className="ath-content-card__teaser">{props.item.teaser}</p>
        )}
        {props.item.tags && props.item.tags.length > 0 &&
          <div className="ath-content-card__tags">
            {props.item.tags.map(tag =>
              <JBadge
                key={tag.id}
                text={tag.name}
                href={`${routes.notes.list}?tags=${tag.id}`}
                variant={tag.variant || undefined}
                linkAs={InternalLink}
              />
            )}
          </div>
        }
      </div>
    </div>
  );
}
