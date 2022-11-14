import {useState} from "react";
import {Editor} from "../../patterns/components/editor/editor";
import {Button} from "@ben-ryder/jigsaw";
import {NoteContent} from "../../state/features/database/athena-database";

export interface NoteEditorProps {
  noteContent: NoteContent
  onSave: (noteContent: NoteContent) => void
}


export function NoteEditor(props: NoteEditorProps) {
  const [error, setError] = useState<string|null>(null);
  const [name, setName] = useState<string>(props.noteContent.name);
  const [body, setBody] = useState<string>(props.noteContent.body);

  function onSave() {
    if (name.length === 0) {
      setError("Your note must have a title");
    }
    else {
      setError(null);
      props.onSave({name, body, tags: []});
    }
  }

  return (
    <div>
      {error && <p className="text-br-red-600">{error}</p>}
      <Button styling="primary" onClick={() => onSave()}>Save</Button>
      <input value={name} onChange={e => {setName(e.target.value)}} placeholder="a note title..."/>
      <Editor value={body} onChange={updatedBody => setBody(updatedBody)} />
    </div>
  )
}
