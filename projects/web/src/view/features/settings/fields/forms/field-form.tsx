import { FormEvent, useMemo, useState } from "react";
import {
  JInput,
  JErrorText,
  JSelect,
  JOptionData, JButtonGroup, JButton, JArrowButton, JForm, JFormContent, JFormRow
} from "@ben-ryder/jigsaw-react";
import {ContentFormProps} from "../../../../common/content-form/content-form";
import {FieldDefinition} from "../../../../../state/schemas/fields/fields";
import { FIELD_TYPES, FieldTypes, FieldTypesList } from "../../../../../state/schemas/fields/field-types";

export interface FieldFormProps extends ContentFormProps<FieldDefinition> {
  disableTypeEdit: boolean
}

export function FieldForm(props: FieldFormProps) {
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<FieldTypes>(props.data.type);
  const [label, setLabel] = useState<string>(props.data.label);


  const fieldOptions: JOptionData[] = useMemo(() => {
    return FieldTypesList.map((field) => ({
        // todo: replace with generic labels, not direct from Jigsaw
        text: FIELD_TYPES[field].label,
        value: FIELD_TYPES[field].identifier,
      }))
  }, []);

  function onSave(e: FormEvent) {
    e.preventDefault()

    let data
    switch (type) {
      case FIELD_TYPES.textShort.identifier:
      case FIELD_TYPES.url.identifier:
      case FIELD_TYPES.number.identifier:
      case FIELD_TYPES.boolean.identifier:
      case FIELD_TYPES.timestamp.identifier:
      case FIELD_TYPES.date.identifier:
      case FIELD_TYPES.textLong.identifier: {
        data = {
          label,
          type,
          required: true
        }
        break
      }
      case FIELD_TYPES.options.identifier: {
        data = {
          label,
          type,
          required: true,
          options: ["Backlog", "Todo", "In Progress", "Done", "Archived"]
        }
        break
      }
      case FIELD_TYPES.scale.identifier: {
        data = {
          label,
          type,
          required: true,
          minLabel: "1",
          maxLabel: "5",
        }
        break
      }
      default: {
        setError("Attempted to save a field type that is not supported.")
        return;
      }
    }

    const parseResult = FieldDefinition.safeParse(data)
    if (!parseResult.success) {
      setError("The given data is invalid")
      console.error(parseResult.error)
      return
    }

    setError(null);
    props.onSave(parseResult.data);
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
            onChange={(e) => {setType(e.target.value as FieldTypes)}}
            disabled={props.disableTypeEdit}
          />
          {props.disableTypeEdit && <JErrorText>A fields type can't be changed. This is to prevent compatibility issues with existing content that may already use this field.</JErrorText>}
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
