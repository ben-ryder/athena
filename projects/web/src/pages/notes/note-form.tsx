import { useMemo, useState } from "react";
import { Editor } from "../../patterns/components/editor/editor";
import {
  JInputControl,
  JLabel,
  JErrorText,
  JMultiSelectControl,
  JMultiSelectOptionData,
} from "@ben-ryder/jigsaw-react";
import { routes } from "../../routes";
import {
  ContentPage,
  ContentPageContent,
  ContentPageField,
  ContentPageMenu,
} from "../../patterns/layout/content-page/content-page";
import { NoteContent } from "../../state/features/database/notes";
import { useLFBApplication } from "../../utils/lfb-context";

export interface NoteFormProps {
  noteContent: NoteContent;
  onSave: (noteContent: NoteContent) => void;
  onDelete?: () => void;
}

export function NoteForm(props: NoteFormProps) {
  const { document } = useLFBApplication();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.noteContent.name);
  const [body, setBody] = useState<string>(props.noteContent.body);

  const [selectedTags, setSelectedTags] = useState<JMultiSelectOptionData[]>(
    props.noteContent.tags.map((tagId) => {
      const tag = document.tags.content.entities[tagId];

      return {
        text: tag.name,
        value: tag.id,
        variant: tag.variant,
      };
    }),
  );

  const tagOptions: JMultiSelectOptionData[] = useMemo(() => {
    const tags = document.tags.content.ids.map(
      (id) => document.tags.content.entities[id],
    );

    return tags.map((tag) => {
      return {
        text: tag.name,
        value: tag.id,
        variant: tag.variant,
      };
    });
  }, [document]);

  function onSave() {
    if (name.length === 0) {
      setError("Your note must have a title");
    } else {
      setError(null);

      const tags = selectedTags.map((tagOption) => tagOption.value);
      props.onSave({ name, body, tags: tags });
    }
  }

  return (
    <ContentPage>
      <ContentPageMenu
        backUrl={routes.notes.list}
        backText="Notes"
        onSave={onSave}
        onDelete={props.onDelete}
      />

      {error && <JErrorText>{error}</JErrorText>}

      <ContentPageContent>
        <ContentPageField modifier="name">
          <JInputControl
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="a note title..."
          />
        </ContentPageField>

        <ContentPageField modifier="tags">
          <JMultiSelectControl
            id="tags"
            label="Tags"
            options={tagOptions}
            selectedOptions={selectedTags}
            setSelectedOptions={setSelectedTags}
            searchText="Search tags..."
            noOptionsText="No tags found"
          />
        </ContentPageField>

        <ContentPageField modifier="body">
          <JLabel htmlFor="note-body">Body</JLabel>
          <Editor
            id="note-body"
            value={body}
            onChange={(updatedBody) => setBody(updatedBody)}
          />
        </ContentPageField>
      </ContentPageContent>
    </ContentPage>
  );
}
