import React from "react";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {ApplicationState, useAppSelector} from "../../../state/store";
import {
  DatabaseNote,
  DatabaseNoteTemplate, DatabaseTask,
  DatabaseTaskList, TaskStatus
} from "../../../state/features/database/athena-database";
import {selectTasks} from "../../../state/features/database/task-lists/tasks/task-selectors";


export interface ContentDetailsProps {
  content: ContentData
}
export function ContentDetails(props: ContentDetailsProps) {
  if (props.content.type === ContentType.TASK_LIST) {
    return <TaskListDetails taskList={props.content.data} />
  }
  else {
    return <TextDetails content={props.content.data} />
  }
}


export interface TextDetailsProps {
  content: DatabaseNote | DatabaseNoteTemplate
}
export function TextDetails(props: TextDetailsProps) {
  const wordCount = props.content.body
    .split(" ")
    .filter(word => word !== "")
    .length;
  const charCount = props.content.body.length;

  return (
    <div className="overflow-x-scroll whitespace-nowrap">
      <p className="text-br-whiteGrey-700 text-center italic">{wordCount} words | {charCount} chars</p>
    </div>
  )
}


export interface TaskListDetailsProps {
  taskList: DatabaseTaskList
}
export function TaskListDetails(props: TaskListDetailsProps) {
  const tasks = useAppSelector((state: ApplicationState) => selectTasks(state, props.taskList.id));
  const openTasks: DatabaseTask[] = [];
  const completedTasks: DatabaseTask[] = [];
  for (const task of tasks) {
    if (task.status === TaskStatus.OPEN) {
      openTasks.push(task);
    }
    else {
      completedTasks.push(task);
    }
  }

  return (
    <p className="text-br-whiteGrey-700 text-center italic">{openTasks.length} open tasks | {completedTasks.length} complete tasks</p>
  )
}