import {NoteEditor} from "./note-editor";
import {NoteContent} from "../../state/features/database/athena-database";
import {v4 as createUUID} from "uuid";
import {useApplication} from "../../helpers/application-context";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import React from "react";


export function CreateNotePage() {
  const navigate = useNavigate();
  const {makeChange} = useApplication();

  async function onSave(newNote: NoteContent) {
    const id = createUUID();
    const timestamp = new Date().toISOString();

    await makeChange((doc) => {
      doc.notes.ids.push(id);
      doc.notes.entities[id] = {
        id: id,
        name: newNote.name,
        body: newNote.body,
        tags: newNote.tags,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    });

    navigate(routes.content.notes.list);
  }

  return (
    <>
      <Helmet>
        <title>Create Note | Athena</title>
      </Helmet>
      <NoteEditor
        noteContent={{name: "", body: "", tags: []}}
        onSave={onSave}
      />
    </>
  )
}
