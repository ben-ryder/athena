import {useState} from "react";
import {Editor} from "../../patterns/components/editor/editor";
import {JInputControl, JLabel, JContentSection, JErrorText} from "@ben-ryder/jigsaw-react";
import {routes} from "../../routes";
import {
  ContentPage,
  ContentPageContent,
  ContentPageField,
  ContentPageMenu
} from "../../patterns/layout/content-page/content-page";
import {NoteContent} from "../../state/features/database/notes";


export interface NoteFormProps {
  noteContent: NoteContent,
  onSave: (noteContent: NoteContent) => void,
  onDelete?: () => void
}

export function NoteForm(props: NoteFormProps) {
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
    <ContentPage>

      <ContentPageMenu
        backUrl={routes.content.notes.list}
        backText="Notes"
        onSave={onSave}
        onDelete={props.onDelete}
      />

      {error &&
          <JErrorText>{error}</JErrorText>
      }

      <ContentPageContent>

        <ContentPageField modifier="name">
          <JInputControl
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={e => {setName(e.target.value)}}
            placeholder="a note title..."
          />
        </ContentPageField>

        <ContentPageField modifier="body">
          <JLabel htmlFor="note-body">Body</JLabel>
          <Editor
            id="note-body"
            value={body}
            onChange={updatedBody => setBody(updatedBody)}
          />
        </ContentPageField>
      </ContentPageContent>

    </ContentPage>
  )
}
