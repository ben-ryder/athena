import {useApplication} from "../../helpers/application-context";
import {useNavigate, useParams} from "react-router-dom";
import {replaceParam, routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import React, {useEffect, useState} from "react";
import {TaskListEntity} from "../../state/features/database/athena-database";
import {TaskListEditor} from "./task-list-editor";
import {ArrowLink} from "../../patterns/element/arrow-link";
import {LinkButton} from "@ben-ryder/jigsaw";


export function ViewTaskListPage() {
  const navigate = useNavigate();
  const params = useParams();
  const {document} = useApplication();

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

  if (error) {
    return <p className="text-br-red-500 text-center">{error}</p>
  }

  if (taskList) {
    return (
      <>
        <Helmet>
          <title>{taskList.name} | Task List | Athena</title>
        </Helmet>
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="flex justify-between items-center">
            <ArrowLink direction="left" link={routes.content.tasks.list}>Task Lists</ArrowLink>
            <LinkButton className="inline-block" href={replaceParam(routes.content.tasks.edit, ":id", taskList.id)}>Edit Task List</LinkButton>
          </div>
        </div>
        <div className="mt-6">
          <h1 className="text-center text-3xl text-br-whiteGrey-100 text-br-teal-600 font-bold">{taskList.name}</h1>
          <div className="mt-2">
            <TaskListEditor taskList={taskList} />
          </div>
        </div>
      </>
    )
  }

  return <p>Loading...</p>
}
