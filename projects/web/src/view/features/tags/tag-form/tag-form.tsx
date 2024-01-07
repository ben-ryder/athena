import { FormEvent, useMemo, useState } from "react";
import {
  JInput,
  JErrorText,
  JSelect,
  JPill,
  JLabel,
  JOptionData, JColourVariants, JButtonGroup, JButton, JArrowButton, JForm, JFormHeader, JFormContent, JFormRow
} from "@ben-ryder/jigsaw-react";
import "./tag-form.scss";
import { TagData, TagVariants } from "../../../../state/database/tags/tags";
import { TagsManagerNavigate } from "../tags-manager";

export interface TagFormProps {
  title: string
  data: TagData;
  onSave: (content: TagData) => void;
  onDelete?: () => void;
  navigate: TagsManagerNavigate
}

export function TagForm(props: TagFormProps) {
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.data.name);
  const [variant, setVariant] = useState<string>(
    props.data.variant || "",
  );

  const tagVariantOptions: JOptionData[] = useMemo(() => {
    return [
      { text: "-- Select Colour --", value: "" },
      ...TagVariants.options.map((variant) => ({
        text: JColourVariants[variant].label,
        value: variant
      }))
    ];
  }, []);

  function onSave(e: FormEvent) {
    e.preventDefault()

    if (name.length === 0) {
      setError("Your tag must have a name");
    }
    else {
      setError(null);
      props.onSave({ name, variant: variant as TagVariants || null });
    }
  }

  return (
    <JForm className="tag-form" onSubmit={onSave}>
      <div className="tag-form__back">
        <JArrowButton
          onClick={() => {
            props.navigate({page: "list"})
          }}
          direction="left"
        >All Tags</JArrowButton>
      </div>
      <div className="tag-form__header">
        <h2>{props.title}</h2>
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
        <JFormRow>
          <JSelect
            id="variant"
            label="Colour"
            options={tagVariantOptions}
            value={variant}
            onChange={(e) => {setVariant(e.target.value)}}
          />
        </JFormRow>
        <JFormRow className="preview-field">
          <JLabel>Preview</JLabel>
            <JPill
              variant={variant as TagVariants || undefined}
            >{name || "Preview"}</JPill>
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
