import {TaskContent} from "../../state/features/database/athena-database";
import {useState} from "react";
import {JButton, JInputControl, JTextAreaControl} from "@ben-ryder/jigsaw-react";

export interface TaskFormProps {
	taskContent?: TaskContent,
	onSubmit: (taskContent: TaskContent) => void,
	submitText: string
}

const INITIAL_TASK_CONTENT: TaskContent = {
	name: "",
	description: "",
	tags: []
}

export function TaskForm(props: TaskFormProps) {
	const [taskContent, setTaskContent] = useState<TaskContent>(props.taskContent || INITIAL_TASK_CONTENT);

	function updateName(name: string) {
		setTaskContent({
			...taskContent,
			name: name
		})
	}

	function updateDescription(description: string) {
		setTaskContent({
			...taskContent,
			description: description
		})
	}

	function updateTags(tags: string[]) {
		setTaskContent({
			...taskContent,
			tags: tags
		})
	}

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();

		props.onSubmit(taskContent);

		setTaskContent(INITIAL_TASK_CONTENT);
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<JInputControl
					id="name"
					label="Name"
					type="text"
					value={taskContent.name}
					onChange={updateName}
				/>
				<JTextAreaControl
					id="description"
					label="Description"
					value={taskContent.description}
					onChange={updateDescription}
				/>
				<JButton type="submit">{props.submitText}</JButton>
			</form>
		</div>
	)
}