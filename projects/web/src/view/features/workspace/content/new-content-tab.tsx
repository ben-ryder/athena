import {ContentForm} from "./content-form";
import {ContentData} from "../../../../state/schemas/content/content";
import { WithTabData } from "../workspace";
import {raw} from "@storybook/react";
import {localful} from "../../../../state/athena-localful";
import {useWorkspaceContext} from "../workspace-context";

export interface NewContentTabProps extends WithTabData {
	contentTypeId: string
}

export function NewContentTab(props: NewContentTabProps) {
	const { replaceTab } = useWorkspaceContext()

	const data = {
		name: '',
		description: undefined,
		type: props.contentTypeId,
		tags: [],
		fields: {}
	}

	async function onSave(data: ContentData) {
		console.log(data)
		const result = await localful.db.create('content', data)
		if (result.success) {
			replaceTab(props.tabIndex, {type: 'content', contentId: result.data})
		}
		else {
			console.error(result.errors)
		}
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