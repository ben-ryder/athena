import {ContentForm} from "./content-form";
import {ContentData} from "../../../../state/schemas/content/content";

export interface NewContentTabProps {
	contentTypeId: string
}

export function NewContentTab(props: NewContentTabProps) {

	const data = {
		name: '',
		description: undefined,
		type: props.contentTypeId,
		tags: [],
		fields: {}
	}

	function onSave(data: ContentData) {
		console.log(data)
	}

	return (
		<div>
			<div>
				<h2>New Content</h2>
			</div>
			<ContentForm
				data={data}
				onSave={onSave}
			/>
		</div>
	)
}