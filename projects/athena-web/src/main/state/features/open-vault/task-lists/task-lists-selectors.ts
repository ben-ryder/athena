import {Tag, Task, TaskList} from "../open-vault-interfaces";

export interface TaskListData extends TaskList {
  tags: Tag[],
  tasks: Task[]
}