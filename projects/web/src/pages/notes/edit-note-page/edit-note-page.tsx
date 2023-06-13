import {NoteForm} from "../note-form/note-form";
import {AthenaDatabase} from "../../../state/features/database/athena-database";
import {useLFBApplication} from "../../../utils/lfb-context";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../../routes";
import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {NoteContent, NoteEntity} from "../../../state/features/database/notes";

export function EditNotePage() {
  const navigate = useNavigate();
  const params = useParams();
  const {makeChange, document} = useLFBApplication();

  const [note, setNote] = useState<NoteEntity|null>();
  const [error, setError] = useState<string|null>();


  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.content.notes.list);
    }

    const note = document.notes.content.entities[params.id];
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

    await makeChange((doc: AthenaDatabase) => {
      const timestamp = new Date().toISOString();

      // check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      if (doc.notes.content.entities[note.id].name !== updatedNote.name) {
        doc.notes.content.entities[note.id].name = updatedNote.name;
      }
      if (doc.notes.content.entities[note.id].body !== updatedNote.body) {
        doc.notes.content.entities[note.id].body = updatedNote.body;
      }

      // todo: don't think this works on arrays
      if (doc.notes.content.entities[note.id].tags !== updatedNote.tags) {
        doc.notes.content.entities[note.id].tags = updatedNote.tags;
      }

      doc.notes.content.entities[note.id].updatedAt = timestamp;
    });

    navigate(routes.content.notes.list);
  }

  async function onDelete() {
    if (!note) {
      return setError("Tried to delete a note that isn't loaded yet.")
    }

    await makeChange((doc: AthenaDatabase) => {
      doc.notes.content.ids = doc.notes.content.ids.filter(id => id !== note.id);
      delete doc.notes.content.entities[note.id];
    });

    navigate(routes.content.notes.list);
  }

  if (note) {
    return (
      <div>
        <Helmet>
          <title>{`${note.name} | Notes | Athena`}</title>
        </Helmet>
        <NoteForm
          noteContent={{
            name: note.name,
            body: note.body,
            tags: note.tags,
            customFields: []
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      </div>
    )
  }

  return null;
}
