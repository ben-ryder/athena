import { JButtonLink, JContentSection, JIcon } from "@ben-ryder/jigsaw-react";
import { FrownIcon as NoContentIcon } from "lucide-react";
import { InternalLink } from "../../components/internal-link";
import { ContentCard, ContentItem } from "../content-card/content-card";
import "./content-list.scss";

export interface ContentListProps {
  items: ContentItem[];
  title: string;
  newUrl: string;
  newText: string;
  // onView: (id: string) => void,
  onDelete: (ids: string[]) => void;
  hideListInfo?: boolean;
}

export function ContentList(props: ContentListProps) {
  return (
    <JContentSection>
      <div className="ath-content-list">
        <div className="ath-content-list__header">
          <h2 className="ath-content-list__heading">{props.title}</h2>
          <div className="ath-content-list__actions">
            <JButtonLink as={InternalLink} href={props.newUrl}>
              {props.newText}
            </JButtonLink>
          </div>
        </div>
        <div className="ath-content-list__list">
          {props.items.length === 0 && (
            <div className="ath-content-list__emtpy-content">
              <JIcon variant="teal" size="xl">
                <NoContentIcon />
              </JIcon>
              <p>No Content Found</p>
            </div>
          )}
          {props.items.map((item) => (
            <ContentCard item={item} />
          ))}
        </div>
        {!props.hideListInfo && (
          <div className="ath-content-list__list-info">
            <p>page 1/1 | 22-42/123 items</p>
          </div>
        )}
      </div>
    </JContentSection>
  );
}
