import {useLFBApplication} from "../../utils/lfb-context";
import React, {useMemo} from "react";
import {replaceParam, routes} from "../../routes";
import {JButtonLink} from "@ben-ryder/jigsaw-react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {InternalLink} from "../../patterns/components/internal-link";

export function NotesPage() {
  const {document} = useLFBApplication();

  const notes = useMemo(() => {
    return document.notes.content.ids.map(id => document.notes.content.entities[id])
  }, [document]);

  return (
    <>
      <Helmet>
        <title>Notes | Athena</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 mt-6 mb-10 flex items-center justify-between">
        <h1 className="text-3xl text-br-whiteGrey-100 text-br-teal-600 font-bold">Notes</h1>
        <JButtonLink href={routes.content.notes.create} as={InternalLink}>New Note</JButtonLink>
      </div>

      {notes.length === 0 && <p className="text-center text-br-whiteGrey-100 mt-4">no notes found</p>}

      <div className="max-w-4xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {notes.map(note =>
          <div key={note.id} className="relative bg-br-atom-500 border-2 border-br-atom-500 shadow-sm hover:border-br-teal-700 p-3">
            <h2 className="text-xl text-br-whiteGrey-200 font-bold">{note.name}</h2>
            <p className="text-br-whiteGrey-200">{note.body.substring(0, 100) + "..."}</p>
            <Link className="absolute w-full h-full top-0 left-0" to={replaceParam(routes.content.notes.edit, ":id", note.id)}>{`view note`}</Link>
          </div>
        )}
      </div>
    </>
  )
}
