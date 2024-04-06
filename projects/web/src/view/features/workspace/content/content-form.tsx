import { FormEvent, useState } from "react";
import {
  JInput,
  JErrorText,
  JButtonGroup, JButton,
  JForm, JFormContent, JFormRow
} from "@ben-ryder/jigsaw-react";
import {ContentData} from "../../../../state/schemas/content/content";

export interface ContentFormProps<Data> {
  data: Data;
  onSave: (content: Data) => void;
  onDelete?: () => void;
}


export function ContentForm(props: ContentFormProps<ContentData>) {
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.data.name);

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
            }}
            placeholder="a note title..."
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
