import {useLFBApplication} from "../../helpers/lfb-context";
import {useNavigate, useParams} from "react-router-dom";
import {replaceParam, routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import React, {useEffect, useState} from "react";
import {TaskListEntity} from "../../state/features/database/athena-database";
import {TaskListEditor} from "./task-list-editor";
import {LinkButton, ArrowLink} from "@ben-ryder/jigsaw";
import {InternalLink} from "../../helpers/internal-link";


export function ViewTaskListPage() {
  const navigate = useNavigate();
  const params = useParams();
  const {document} = useLFBApplication();

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
        <div className="max-w-4xl mx-auto mt-6 mb-10 px-4">
          <div className="flex justify-between items-center">
            <ArrowLink as={InternalLink} direction="left" href={routes.content.tasks.list}>Task Lists</ArrowLink>
            <LinkButton as={InternalLink} className="inline-block" href={replaceParam(routes.content.tasks.edit, ":id", taskList.id)}>Edit Task List</LinkButton>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-6 px-4">
          <h1 className="text-3xl text-br-whiteGrey-100 text-br-teal-600 font-bold">{taskList.name}</h1>
          <div className="mt-4g">
            <TaskListEditor taskList={taskList} />
          </div>
        </div>
      </>
    )
  }

  return null;
}
