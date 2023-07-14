import { FormEvent, useState } from "react";
import {
  JButton,
  JInputControl,
  JTextAreaControl,
} from "@ben-ryder/jigsaw-react";
import { TaskContent } from "../../state/features/database/tasks";

export interface TaskFormProps {
  taskContent?: TaskContent;
  onSubmit: (taskContent: TaskContent) => void;
  submitText: string;
}

const INITIAL_TASK_CONTENT: TaskContent = {
  name: "",
  tags: [],
};

export function TaskForm(props: TaskFormProps) {
  const [taskContent, setTaskContent] = useState<TaskContent>(
    props.taskContent || INITIAL_TASK_CONTENT,
  );

  function updateName(name: string) {
    setTaskContent({
      ...taskContent,
      name: name,
    });
  }

  function updateTags(tags: string[]) {
    setTaskContent({
      ...taskContent,
      tags: tags,
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
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
          onChange={(e) => {
            updateName(e.target.value);
          }}
        />
        <JButton type="submit">{props.submitText}</JButton>
      </form>
    </div>
  );
}
