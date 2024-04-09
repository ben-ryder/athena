import { FormEvent, useState } from "react";
import {
  JInput,
  JErrorText,
  JButtonGroup, JButton,
  JForm, JFormContent, JFormRow, JMultiSelectOptionData, JTextArea, JMultiSelect
} from "@ben-ryder/jigsaw-react";
import {ContentData} from "../../../../state/schemas/content/content";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { localful } from "../../../../state/athena-localful";
import { QueryStatus } from "@localful-athena/control-flow";
import { WithTabData } from "../workspace";
import { useWorkspaceContext } from "../workspace-context";

export interface ContentFormProps<Data> extends WithTabData {
  data: Data;
  onSave: (content: Data) => void;
  onDelete?: () => void;
}


export function ContentForm(props: ContentFormProps<ContentData>) {
  const { updateTabMetadata } = useWorkspaceContext()

  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.data.name);
  const [description, setDescription] = useState<string>(props.data.description || '');

  const [tags, setTags] = useState<JMultiSelectOptionData[]>([]);
  const allTags = useObservableQuery(localful.db.observableQuery('tags'))
  const tagOptions: JMultiSelectOptionData[] = allTags.status === QueryStatus.SUCCESS
    ? allTags.data.map(tag => ({
      text: tag.data.name,
      value: tag.id,
      variant: tag.data.colourVariant
    }))
    : []

  function onSave(e: FormEvent) {
    e.preventDefault()

    if (name.length === 0) {
      setError("Your content must have a name");
    }
    else {
      setError(null);
      props.onSave({
        type: props.data.type,
        name: name,
        description: undefined,
        tags: [],
        fields: {}
      });
    }
  }

  return (
    <JForm className="content-form" onSubmit={onSave}>
      <div className="content-form__header">
        {error && <JErrorText>{error}</JErrorText>}
      </div>
      <JFormContent>
        <JFormRow>
          <JInput
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              updateTabMetadata(props.tabIndex, { name: e.target.value, contentUnsaved: true })
            }}
            placeholder="your content name..."
          />
        </JFormRow>
        <JFormRow>
          <JTextArea
            label="Description"
            id="description"
            value={description}
            rows={3}
            onChange={(e) => {
              setDescription(e.target.value);
              updateTabMetadata(props.tabIndex, { contentUnsaved: true })
            }}
            placeholder="a short descripction of your content..."
          />
        </JFormRow>
        <JFormRow>
          <JMultiSelect
            id="tags"
            label="Tags"
            options={tagOptions}
            selectedOptions={tags}
            setSelectedOptions={(tags) => {
              setTags(tags)
              updateTabMetadata(props.tabIndex, { contentUnsaved: true })
            }}
            searchText="search and select tags..."
            noOptionsText="No Tags Found"
          />
        </JFormRow>
      </JFormContent>

      <JFormRow>
        <JButtonGroup>
          {props.onDelete &&
            <JButton
              type="button"
              variant="destructive"
              onClick={() => {
                if (props.onDelete) {
                  props.onDelete()
                }
              }}
            >Delete</JButton>
          }
          <JButton type="submit">Save</JButton>
        </JButtonGroup>
      </JFormRow>
    </JForm>
  );
}
