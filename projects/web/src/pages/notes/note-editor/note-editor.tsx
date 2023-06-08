import {useState} from "react";
import {Editor} from "../../../patterns/components/editor/editor";
import {JButton, JArrowLink, JInputControl, JLabel, JContentSection, JErrorText} from "@ben-ryder/jigsaw-react";
import {NoteContent} from "../../../state/features/database/athena-database";
import {routes} from "../../../routes";
import {InternalLink} from "../../../patterns/components/internal-link";
import "./_note-editor.scss";

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
    <JContentSection>
      <div className="ath-note-editor">

        <div className="ath-note-editor__menu">
          <JArrowLink as={InternalLink} direction="left" href={routes.content.notes.list}>Notes</JArrowLink>

          <div className="ath-note-editor__actions">
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

        {error &&
          <div className="ath-note-editor__errors">
            <JErrorText>{error}</JErrorText>
          </div>
        }

        <div className="ath-note-editor__content">

          <div className="ath-note-editor__name">
            <JInputControl
              label="Name"
              id="name"
              type="text"
              value={name}
              onChange={e => {setName(e.target.value)}}
              placeholder="a note title..."
            />
          </div>

          <div className="ath-note-editor__body">
            <JLabel htmlFor="note-body">Body</JLabel>
            <Editor
              id="note-body"
              value={body}
              onChange={updatedBody => setBody(updatedBody)}
            />
          </div>
        </div>

      </div>
    </JContentSection>
  )
}
