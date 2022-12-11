import {v4 as createUUID} from "uuid";
import {useLFBApplication} from "../../helpers/lfb-context";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import React from "react";
import {TaskFormData, TaskListForm} from "./task-form";


export function CreateTaskListPage() {
  const navigate = useNavigate();
  const {makeChange} = useLFBApplication();

  async function onSave(values: TaskFormData) {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    await makeChange((doc) => {
      doc.taskLists.ids.push(id);
      doc.taskLists.entities[id] = {
        id: id,
        name: values.name,
        tags: [],
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    navigate(routes.content.tasks.list);
  }

  return (
    <>
      <Helmet>
        <title>Create Task List | Athena</title>
      </Helmet>
      <TaskListForm values={{name: "", tags: []}} onSave={onSave} />
    </>
  )
}
