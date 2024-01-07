import { useMemo, useState } from "react";
import {
  JInput,
  JErrorText,
  JSelect,
  JPill,
  JLabel,
  JOptionData, JColourVariants, JButtonGroup, JButton, JArrowButton
} from "@ben-ryder/jigsaw-react";
import "./tag-form.scss";
import { TagData, TagVariants } from "../../../../state/data/database/tags/tags";
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

  function onSave() {
    if (name.length === 0) {
      setError("Your tag must have a name");
    }
    else {
      setError(null);
      props.onSave({ name, variant: variant as TagVariants || null });
    }
  }

  return (
    <div>
      <JArrowButton
        onClick={() => {
          props.navigate({page: "list"})
        }}
        direction="left"
      >All Tags</JArrowButton>

      <h2>{props.title}</h2>

      {error && <JErrorText>{error}</JErrorText>}

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

      <JSelect
        id="variant"
        label="Colour"
        options={tagVariantOptions}
        value={variant}
        onChange={(e) => {setVariant(e.target.value)}}
      />
        <JLabel>Preview</JLabel>
        <JPill
          variant={variant as TagVariants || undefined}
        >{name}</JPill>

      <JButtonGroup>
        {props.onDelete &&
          <JButton
            variant="destructive"
            onClick={() => {
              if (props.onDelete) {
                props.onDelete()
              }
            }}
          >Delete</JButton>
        }
        <JButton onClick={onSave}>Save</JButton>
      </JButtonGroup>
</div>
  );
}
