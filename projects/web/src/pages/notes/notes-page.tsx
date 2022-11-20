import {useApplication} from "../../helpers/application-context";
import {useMemo} from "react";
import {replaceParam, routes} from "../../routes";
import {LinkButton} from "@ben-ryder/jigsaw";
import {Link} from "react-router-dom";


export function NotesPage() {
  const {document} = useApplication();

  const notes = useMemo(() => {
    return document.notes.ids.map(id => document.notes.entities[id])
  }, [document]);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 m-3 flex items-center justify-between">
        <h1 className="text-3xl text-br-whiteGrey-100 text-br-teal-600 font-bold">All Notes</h1>
        <LinkButton className="inline-block" href={routes.content.notes.create}>New Note</LinkButton>
      </div>

      {notes.length === 0 && <p>no notes found</p>}

      <div className="max-w-4xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {notes.map(note =>
          <div key={note.id} className="relative bg-br-atom-600 border-2 border-br-atom-600 hover:border-br-teal-700 p-3">
            <h2 className="text-xl text-br-whiteGrey-200 font-bold">{note.name}</h2>
            <p className="text-br-whiteGrey-200">{note.body.substring(0, 100) + "..."}</p>
            <Link className="absolute w-full h-full top-0 left-0" to={replaceParam(routes.content.notes.edit, ":noteId", note.id)} aria-label={`view note ${note.name}`} />
          </div>
        )}
      </div>
    </>
  )
}
