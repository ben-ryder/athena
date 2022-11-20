import {useState} from "react";
import {Editor} from "../../patterns/components/editor/editor";
import {Button} from "@ben-ryder/jigsaw";
import {NoteContent} from "../../state/features/database/athena-database";
import {routes} from "../../routes";
import classNames from "classnames";
import {ArrowLink} from "../../patterns/element/arrow-link";

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
      props.onSave({name, body, tags: []});
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4">
      <div className="flex justify-between items-center">
        <ArrowLink direction="left" link={routes.content.notes.list}>Notes</ArrowLink>

        <div className="flex items-center justify-center">
          {props.onDelete &&
              <Button
                  className="mr-2"
                  styling="destructive"
                  onClick={() => {
                    if (props.onDelete) {
                      props.onDelete();
                    }
                  }}
              >Delete</Button>
          }
          <Button styling="primary" onClick={() => onSave()}>Save</Button>
        </div>
      </div>
      {error && <p className="text-br-red-600">{error}</p>}
      <div className="mt-4">
        <input
          type="text"
          value={name}
          onChange={e => {setName(e.target.value)}}
          placeholder="a note title..."
          className={classNames(
            "w-full py-1 px-0 bg-transparent text-4xl font-bold border-0 border-b-2",
            "text-br-whiteGrey-100 border-br-atom-700",
            "focus:ring-0 focus:border-br-teal-600"
          )}
        />
        <Editor
          value={body}
          onChange={updatedBody => setBody(updatedBody)}
        />
      </div>
    </div>
  )
}
