import {ContentForm} from "./content-form";
import {ContentData} from "../../../../state/schemas/content/content";
import { WithTabData } from "../workspace";

export interface NewContentTabProps extends WithTabData {
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
				tabIndex={props.tabIndex}
			/>
		</div>
	)
}