import {useState} from "react";
import {Editor} from "../../patterns/components/editor/editor";
import {JButton, JArrowLink, JInputControl} from "@ben-ryder/jigsaw-react";
import {NoteContent} from "../../state/features/database/athena-database";
import {routes} from "../../routes";
import {InternalLink} from "../../patterns/components/internal-link";

export interface NoteEditorProps {
  noteContent: NoteContent,
  onSave: (noteContent: NoteContent) => void,
  onDelete?: () => void
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
      props.onSave({name, body, tags: [], customFields: []});
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4">
      <div className="flex justify-between items-center mt-6 mb-10">
        <JArrowLink as={InternalLink} direction="left" href={routes.content.notes.list}>Notes</JArrowLink>

        <div className="flex items-center justify-center">
          {props.onDelete &&
              <JButton
                  variant="destructive"
                  onClick={() => {
                    if (props.onDelete) {
                      props.onDelete();
                    }
                  }}
              >Delete</JButton>
          }
          <JButton onClick={() => onSave()}>Save</JButton>
        </div>
      </div>
      {error && <p className="text-br-red-600">{error}</p>}
      <div className="mt-4">
        <JInputControl
          id="name"
          label="Name"
          type="text"
          value={name}
          onChange={e => {setName(e.target.value)}}
          placeholder="a note title..."
        />
        <Editor
          value={body}
          onChange={updatedBody => setBody(updatedBody)}
        />
      </div>
    </div>
  )
}
