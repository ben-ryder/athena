import React from "react";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {ApplicationState, useAppSelector} from "../../../state/store";
import {selectTasks} from "../../../state/features/current-vault/task-lists/tasks/task-selectors";
import {DatabaseTask, TaskStatus} from "../../../state/features/current-vault/task-lists/tasks/task-interface";
import {DatabaseTaskList} from "../../../state/features/current-vault/task-lists/task-lists-interface";
import {DatabaseNote} from "../../../state/features/current-vault/notes/notes-interface";
import {DatabaseNoteTemplate} from "../../../state/features/current-vault/note-templates/note-templates-interface";


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