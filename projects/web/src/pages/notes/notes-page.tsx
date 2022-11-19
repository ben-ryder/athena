import {useApplication} from "../../helpers/application-context";
import {useMemo} from "react";
import {replaceParam, routes} from "../../routes";
import {LinkButton} from "@ben-ryder/jigsaw";


export function NotesPage() {
  const {document} = useApplication();

  const notes = useMemo(() => {
    return document.notes.ids.map(id => document.notes.entities[id])
  }, [document]);

  return (
    <div>
      <div className="mb-3">
        <LinkButton className="inline-block" href={routes.content.notes.create}>add note</LinkButton>
      </div>

      {notes.length === 0 && <p>no notes found</p>}

      <div className="md:grid md:grid-cols-3 gap-6 mx-6">
        {notes.map(note =>
          <div key={note.id} className="relative bg-br-atom-600 p-3">
            <h2>{note.name}</h2>
            <a className="absolute w-full h-full top-0 left-0" href={replaceParam(routes.content.notes.edit, ":noteId", note.id)} aria-label={`view note ${note.name}`} />
          </div>
        )}
      </div>

    </div>
  )
}
