
export interface ContentItem {
	id: string,
	name: string,
	teaser?: string,
	url: string
}

export function ContentCard(props: ContentItem) {
	return (
		<div className="ath-content-card">
			<h3 className="ath-content-card__name">{props.name}</h3>
			{props.teaser &&
          <p className="ath-content-card__teaser">{props.teaser}</p>
			}
			<a className="ath-content-card__link" href={props.url}>{`go to ${props.name}`}</a>
		</div>
	)
}
