import {ContentManagerNavigate} from "../content-manager/content-manager";

export interface ContentFormProps<Data> {
	title: string
	data: Data;
	onSave: (content: Data) => void;
	onDelete?: () => void;
	navigate: ContentManagerNavigate
}
