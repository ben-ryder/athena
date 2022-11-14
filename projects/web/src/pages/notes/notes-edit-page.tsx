import {NoteEditor} from "./note-editor";
import {NoteContent, NoteEntity} from "../../state/features/database/athena-database";
import {application, useDocument} from "../../helpers/application-context";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../routes";
import {useEffect, useState} from "react";
import {Button} from "@ben-ryder/jigsaw";


export function NotesEditPage() {
  const navigate = useNavigate();
  const params = useParams();

  const {document} = useDocument();
  const [note, setNote] = useState<NoteEntity|null>();
  const [error, setError] = useState<string|null>();


  useEffect(() => {
    if (!params.noteId) {
      return navigate(routes.content.notes.list);
    }

    const note = document.notes.entities[params.noteId];
    if (!note) {
      setError("The note could not be found");
    }

    setNote(note);
  }, [document, setNote]);

  async function onSave(updatedNote: NoteContent) {
    if (!note) {
      return setError("Tried to save a note that isn't loaded yet.")
    }

    await application.makeChange((doc) => {
      // check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      if (doc.notes.entities[note.id].name !== updatedNote.name) {
        doc.notes.entities[note.id].name = updatedNote.name;
      }
      if (doc.notes.entities[note.id].body !== updatedNote.body) {
        doc.notes.entities[note.id].body = updatedNote.body;
      }

      // todo: don't think this works on arrays
      if (doc.notes.entities[note.id].tags !== updatedNote.tags) {
        doc.notes.entities[note.id].tags = updatedNote.tags;
      }
    });

    navigate(routes.content.notes.list);
  }

  async function onDelete() {
    if (!note) {
      return setError("Tried to delete a note that isn't loaded yet.")
    }

    await application.makeChange((doc) => {
      doc.notes.ids = doc.notes.ids.filter(id => id !== note.id);
      delete doc.notes.entities[note.id];
    });

    navigate(routes.content.notes.list);
  }

  if (error) {
    return <p className="text-br-red-500">{error}</p>
  }

  if (note) {
    return (
      <div>
        <Button styling="destructive" onClick={onDelete}>Delete</Button>
        <NoteEditor
          noteContent={{
            name: note.name,
            body: note.body,
            tags: note.tags
          }}
          onSave={onSave}
        />
      </div>
    )
  }

  return <p>Loading...</p>
}
