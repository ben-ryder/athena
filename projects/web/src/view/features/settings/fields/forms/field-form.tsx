import { FormEvent, useMemo, useState } from "react";
import {
  JInput,
  JErrorText,
  JSelect,
  JPill,
  JLabel,
  JOptionData, JColourVariants, JButtonGroup, JButton, JArrowButton, JForm, JFormContent, JFormRow
} from "@ben-ryder/jigsaw-react";
import { ColourVariants } from "../../../../../state/schemas/common/fields";
import {ContentFormProps} from "../../../../common/content-form/content-form";
import {FieldDefinition, FieldTypeLabels, FieldTypes, FieldTypeValues} from "../../../../../state/schemas/fields/fields";

export function FieldForm(props: ContentFormProps<FieldDefinition>) {
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<FieldTypeValues>(props.data.type);
  const [label, setLabel] = useState<string>(props.data.label);


  const fieldOptions: JOptionData[] = useMemo(() => {
    return [
      ...Object.keys(FieldTypes).map((fieldLabel) => ({
        // todo: replace with generic labels, not direct from Jigsaw
        text: fieldLabel,
        value: FieldTypes[fieldLabel as FieldTypeLabels]
      }))
    ];
  }, []);

  function onSave(e: FormEvent) {
    e.preventDefault()

    // if (name.length === 0) {
    //   setError("Your tag must have a name");
    // }
    // else {
    //   setError(null);
    //   props.onSave({ name: name, colourVariant: colourVariant || undefined });
    // }
  }

  return (
    <JForm className="content-form" onSubmit={onSave}>
      <div className="content-form__back">
        <JArrowButton
          onClick={() => {
            props.navigate({screen: "list"})
          }}
          direction="left"
        >Back</JArrowButton>
      </div>
      <div className="tag-form__header">
        <h2>{props.title}</h2>
        {error && <JErrorText>{error}</JErrorText>}
      </div>
      <JFormContent>
        <JFormRow>
          <JInput
            label="Label"
            id="label"
            type="text"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            placeholder="a field label..."
          />
        </JFormRow>
        <JFormRow>
          <JSelect
            label="Type"
            id="type"
            options={fieldOptions}
            value={type}
            onChange={(e) => {setType(e.target.value as FieldTypeValues)}}
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
