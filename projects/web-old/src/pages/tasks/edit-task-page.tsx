import {useLFBApplication} from "../../helpers/lfb-context";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import React, {useEffect, useState} from "react";
import {TaskListForm} from "./task-form";
import {TaskListContent, TaskListEntity} from "../../state/features/database/athena-database";


export function EditTaskListPage() {
  const navigate = useNavigate();
  const params = useParams();
  const {makeChange, document} = useLFBApplication();

  const [taskList, setTaskList] = useState<TaskListEntity|null>();
  const [error, setError] = useState<string|null>();

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.content.tasks.list);
    }

    const taskList = document.taskLists.entities[params.id];
    if (!taskList) {
      setError("The task list could not be found");
      setTaskList(null);
    }
    else {
      setTaskList(taskList);
    }
  }, [document, setTaskList]);

  async function onSave(updatedTaskList: TaskListContent) {
    if (!taskList) {
      return setError("Tried to save a task list that isn't loaded yet.")
    }

    await makeChange((doc) => {
      const timestamp = new Date().toISOString();

      // check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      if (doc.taskLists.entities[taskList.id].name !== updatedTaskList.name) {
        doc.taskLists.entities[taskList.id].name = updatedTaskList.name;
      }

      // todo: don't think this works on arrays
      if (doc.taskLists.entities[taskList.id].tags !== updatedTaskList.tags) {
        doc.taskLists.entities[taskList.id].tags = updatedTaskList.tags;
      }

      doc.notes.entities[taskList.id].updatedAt = timestamp;
    });

    navigate(routes.content.tasks.list);
  }

  async function onDelete() {
    if (!taskList) {
      return setError("Tried to delete a task list that isn't loaded yet.")
    }

    await makeChange((doc) => {
      doc.taskLists.ids = doc.taskLists.ids.filter(id => id !== taskList.id);
      delete doc.taskLists.entities[taskList.id];
    });

    navigate(routes.content.tasks.list);
  }

  if (error) {
    return <p className="text-br-red-500 text-center">{error}</p>
  }

  if (taskList) {
    return (
      <>
        <Helmet>
          <title>{taskList.name} | Task List | Athena</title>
        </Helmet>
        <TaskListForm values={{name: taskList.name, tags: taskList.tags}} onSave={onSave} onDelete={onDelete} />
      </>
    )
  }

  return <p>Loading...</p>
}
