import {NoteEditor} from "./note-editor";
import {NoteContent, NoteEntity} from "../../state/features/database/athena-database";
import {useApplication} from "../../helpers/application-context";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../routes";
import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";


export function EditNotePage() {
  const navigate = useNavigate();
  const params = useParams();
  const {makeChange, document} = useApplication();

  const [note, setNote] = useState<NoteEntity|null>();
  const [error, setError] = useState<string|null>();


  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.content.notes.list);
    }

    const note = document.notes.entities[params.id];
    if (!note) {
      setError("The note could not be found");
      setNote(null);
    }
    else {
      setNote(note);
    }
  }, [document, setNote]);

  async function onSave(updatedNote: NoteContent) {
    if (!note) {
      return setError("Tried to save a note that isn't loaded yet.")
    }

    await makeChange((doc) => {
      const timestamp = new Date().toISOString();

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

      doc.notes.entities[note.id].updatedAt = timestamp;
    });

    navigate(routes.content.notes.list);
  }

  async function onDelete() {
    if (!note) {
      return setError("Tried to delete a note that isn't loaded yet.")
    }

    await makeChange((doc) => {
      doc.notes.ids = doc.notes.ids.filter(id => id !== note.id);
      delete doc.notes.entities[note.id];
    });

    navigate(routes.content.notes.list);
  }

  if (error) {
    return <p className="text-br-red-500 text-center">{error}</p>
  }

  if (note) {
    return (
      <>
        <Helmet>
          <title>{`${note.name} | Notes | Athena`}</title>
        </Helmet>
        <NoteEditor
          noteContent={{
            name: note.name,
            body: note.body,
            tags: note.tags
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      </>
    )
  }

  return null;
}
