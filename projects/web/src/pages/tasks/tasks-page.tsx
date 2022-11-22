import {useApplication} from "../../helpers/application-context";
import React, {useMemo} from "react";
import {replaceParam, routes} from "../../routes";
import {LinkButton} from "@ben-ryder/jigsaw";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {InternalLink} from "../../helpers/internal-link";


export function TasksPage() {
  const {document} = useApplication();

  const taskLists = useMemo(() => {
    return document.taskLists.ids.map(id => document.taskLists.entities[id]);
  }, [document]);

  return (
    <>
      <Helmet>
        <title>Task Lists | Athena</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 mt-6 mb-10 flex items-center justify-between">
        <h1 className="text-3xl text-br-whiteGrey-100 text-br-teal-600 font-bold">Task Lists</h1>
        <LinkButton as={InternalLink} className="inline-block" href={routes.content.tasks.create}>New Task List</LinkButton>
      </div>

      {taskLists.length === 0 && <p className="text-center text-br-whiteGrey-100 mt-4">no task lists found</p>}

      <div className="max-w-4xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {taskLists.map(taskList =>
          <div key={taskList.id} className="relative bg-br-atom-500 border-2 border-br-atom-500 shadow-sm hover:border-br-teal-700 p-3">
            <h2 className="text-xl text-br-whiteGrey-200 font-bold">{taskList.name}</h2>
            <Link className="absolute w-full h-full top-0 left-0" to={replaceParam(routes.content.tasks.view, ":id", taskList.id)} aria-label={`view task list ${taskList.name}`} />
          </div>
        )}
      </div>
    </>
  )
}
