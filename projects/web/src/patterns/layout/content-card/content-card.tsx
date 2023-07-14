import "./content-card.scss";
import { Link } from "react-router-dom";

export interface ContentItem {
  id: string;
  name: string;
  teaser?: string;
  url: string;
}

export interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard(props: ContentCardProps) {
  return (
    <div className="ath-content-card">
      <div className="ath-content-card__content">
        <h3 className="ath-content-card__name">{props.item.name}</h3>
        {props.item.teaser && (
          <p className="ath-content-card__teaser">{props.item.teaser}</p>
        )}
        <Link className="ath-content-card__link" to={props.item.url}>
          <span className="j-hidden">{`go to ${props.item.name}`}</span>
        </Link>
      </div>
    </div>
  );
}
