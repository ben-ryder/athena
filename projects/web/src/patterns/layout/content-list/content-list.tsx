import {JButtonLink, JIcon} from "@ben-ryder/jigsaw-react";
import {FrownIcon as NoContentIcon} from "lucide-react";

export interface ContentItem {
	id: string,
	name: string,
	teaser?: string
}

export interface ContentListProps {
	items: ContentItem[],
	title: string,
	newUrl: string,
	newText: string,
	getItemUrl: (id: string) => string,
	onView: (id: string) => void,
	onDelete: (ids: string[]) => void
}

export function ContentList(props: ContentListProps) {

	return (
		<div className="ath-content-list">
			<div className="ath-content-list__header">
				<h2 className="ath-content-list__heading">{props.title}</h2>
				<JButtonLink href={props.newUrl}>{props.newText}</JButtonLink>
			</div>
			<div className="ath-content-list__list">
				{props.items.length === 0 &
            <div className="ath-content-list__emtpy-content">
                <JIcon><NoContentIcon/></JIcon>
                <p>No Content Found</p>
            </div>
				}
				{props.items.map(item =>
					<div className="ath-content-card">
						<h3 className="ath-content-card__name">{item.name}</h3>
						{item.teaser & <p className="ath-content-card__teaser">{item.teaser}</p>}
						<a className="ath-content-card__link" href={props.getItemUrl(item.id)}>{`go to ${item.name}`}</a>
					</div>
				)}
			</div>
		</div>
	)
}
