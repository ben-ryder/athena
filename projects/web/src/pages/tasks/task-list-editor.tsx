import {v4 as createUUID} from "uuid";
import classNames from "classnames";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {
  Check as CompleteIcon,
  Edit2 as EditIcon,
  Save as SaveIcon,
  Trash as DeleteIcon,
  X as ReopenIcon,
  X as CancelIcon
} from "lucide-react";
import {useRef, useState} from "react";
import {
  AthenaDatabase,
  TaskContent,
  TaskEntity,
  TaskListEntity,
  TaskStatus
} from "../../state/features/database/athena-database";
import {useApplication} from "../../helpers/application-context";
import {ChangeFn} from "@automerge/automerge";

// todo: dont define type here?
type MakeChange = (changeFunc: ChangeFn<AthenaDatabase>) => void;
async function renameTask(makeChange: MakeChange, taskId: string, newName: string) {
  await makeChange((doc) => {
    doc.tasks.entities[taskId].name = newName;
  });
}

async function deleteTask(makeChange: MakeChange, taskId: string) {
  await makeChange((doc) => {
    doc.tasks.ids = doc.tasks.ids.filter(id => id !== taskId);
    delete doc.tasks.entities[taskId];
  });
}

async function completeTask(makeChange: MakeChange, taskId: string) {
  await makeChange((doc) => {
    doc.tasks.entities[taskId].status = TaskStatus.COMPLETED;
  });
}

async function reopenTask(makeChange: MakeChange, taskId: string) {
  await makeChange((doc) => {
    doc.tasks.entities[taskId].status = TaskStatus.OPEN;
  });
}

async function createTask(makeChange: MakeChange, taskContent: TaskContent) {
  await makeChange((doc) => {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    doc.tasks.ids.push(id);
    doc.tasks.entities[id] = {
      id,
      taskListId: taskContent.taskListId,
      name: taskContent.name,
      status: taskContent.status,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  });
}

const wrapperClassName = "border-b border-br-atom-500 flex justify-between items-center";

export interface TaskListEditorProps {
  taskList: TaskListEntity
}
export function TaskListEditor(props: TaskListEditorProps) {
  const {document} = useApplication();

  const tasks = document.tasks.ids
    .filter(id => {
      const task = document.tasks.entities[id];
      return task.taskListId === props.taskList.id
    })
    .map(id => document.tasks.entities[id]);

  const openTasks: TaskEntity[] = [];
  const completedTasks: TaskEntity[] = [];
  for (const task of tasks) {
    if (task.status === TaskStatus.OPEN) {
      openTasks.push(task);
    }
    else {
      completedTasks.push(task);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="my-2">
        <NewTaskForm taskList={props.taskList} />
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-br-whiteGrey-100 text-lg border-b-2 border-br-blueGrey-600">Open Tasks</h2>
        <div className={classNames("mt-4", { "mt-4 border-t border-br-atom-500": openTasks.length > 0})}>
          {openTasks.map(task => <Task key={task.id} task={task} />)}
          {openTasks.length === 0 && <p className="text-br-whiteGrey-200 text-center">No Open Tasks</p>}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-bold text-br-whiteGrey-100 text-lg border-b-2 border-br-blueGrey-600">Completed Tasks</h2>
        <div className={classNames("mt-4", { "mt-4 border-t border-br-atom-500": completedTasks.length > 0})}>
          {completedTasks.map(task => <Task key={task.id} task={task} />)}
          {completedTasks.length === 0 && <p className="text-br-whiteGrey-100 text-center">No Completed Tasks</p>}
        </div>
      </div>
    </div>
  )
}

export interface TaskProps {
  task: TaskEntity
}
export function Task(props: TaskProps) {
  const {makeChange} = useApplication();
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [nameEdit, setNameEdit] = useState<string>(props.task.name);
  const nameEditRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={classNames(wrapperClassName, {"hidden": !isEditActive})}>
        <input
          ref={nameEditRef}
          value={nameEdit}
          onChange={(e) => {setNameEdit(e.target.value)}}
          className="bg-transparent w-full text-br-whiteGrey-100 py-1.5"
        />
        <div className="flex items-center">
          <IconButton
            className="ml-2"
            label={`Delete task ${props.task.name}`}
            icon={<SaveIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
            onClick={async () => {
              await renameTask(makeChange, props.task.id, nameEdit);
              setIsEditActive(false);
            }}
          />
          <IconButton
            className="ml-4"
            label={`Edit task ${props.task.name}`}
            icon={<CancelIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
            onClick={() => {
              setIsEditActive(false);
            }}
          />
        </div>
      </div>
      <div className={classNames(wrapperClassName, {"hidden": isEditActive})}>
        <p className={classNames(
          "text-br-whiteGrey-100 py-1.5",
          {
            "line-through decoration-br-whiteGrey-200": props.task.status === TaskStatus.COMPLETED
          }
        )}>{props.task.name}</p>

        <div className="flex items-center">
          {props.task.status === TaskStatus.OPEN &&
              <IconButton
                  className="ml-2"
                  label={`Complete task ${props.task.name}`}
                  icon={<CompleteIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
                  onClick={async() => {
                    await completeTask(makeChange, props.task.id)
                  }}
              />
          }
          {props.task.status === TaskStatus.COMPLETED &&
              <IconButton
                  className="ml-2"
                  label={`Reopen task ${props.task.name}`}
                  icon={<ReopenIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
                  onClick={async () => {
                    await reopenTask(makeChange, props.task.id)
                  }}
              />
          }
          <IconButton
            className="ml-4"
            label={`Edit task ${props.task.name}`}
            icon={<EditIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
            onClick={() => {
              setIsEditActive(true);

              setTimeout(() => {
                if (nameEditRef.current) {
                  nameEditRef.current.focus();
                }
              }, 100);
            }}
          />
          <IconButton
            className="ml-2"
            label={`Delete task ${props.task.name}`}
            icon={<DeleteIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
            onClick={async () => {
              await deleteTask(makeChange, props.task.id)
            }}
          />
        </div>
      </div>
    </>
  )
}

export interface NewTaskFormProps {
  taskList: TaskListEntity
}
export function NewTaskForm(props: NewTaskFormProps) {
  const {makeChange} = useApplication();
  const [name, setName] = useState<string>("");

  return (
    <form
      className={wrapperClassName}
      onSubmit={async (e) => {
        e.preventDefault();
        await createTask(makeChange,{name, taskListId: props.taskList.id, status: TaskStatus.OPEN});
        setName("");
      }}
      onReset={e => {
        e.preventDefault();
        setName("");
      }}
    >
      <input
        type="text"
        value={name}
        placeholder="enter new task..."
        onChange={(e) => {setName(e.target.value)}}
        className={classNames(
          "bg-transparent w-full text-br-whiteGrey-100 p-1.5",
          "border-transparent outline-none focus:ring-0",
          "border-2 focus:border-br-teal-600"
        )}
      />
      <div className="flex items-center">
        <button className="text-br-whiteGrey-100 font-bold ml-2" type="reset">clear</button>
        <button className="text-br-whiteGrey-100 font-bold ml-2" type="submit">add</button>
      </div>
    </form>
  )
}
