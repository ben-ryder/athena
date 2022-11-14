import {NoteEditor} from "./note-editor";
import {NoteContent} from "../../state/features/database/athena-database";
import {v4 as createUUID} from "uuid";
import {application} from "../../helpers/application-context";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes";


export function NotesCreatePage() {
  const navigate = useNavigate();

  async function onSave(newNote: NoteContent) {
    const id = createUUID();
    console.log("create note", newNote);
    await application.makeChange((doc) => {
      doc.notes.ids.push(id);
      doc.notes.entities[id] = {
        id: id,
        name: newNote.name,
        body: newNote.body,
        tags: newNote.tags,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    });

    navigate(routes.content.notes.list);
  }

  return (
    <NoteEditor
      noteContent={{name: "", body: "", tags: []}}
      onSave={onSave}
    />
  )
}
