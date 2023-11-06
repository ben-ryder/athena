import { useMemo, useState } from "react";
import {
  JInputControl,
  JErrorText,
  JSelectControl,
  JBadge,
  JLabel,
} from "@ben-ryder/jigsaw-react";
import { routes } from "../../../routes";
import {
  ContentPage,
  ContentPageContent,
  ContentPageField,
  ContentPageMenu,
} from "../../../patterns/layout/content-page/content-page";
import { TagContent } from "../../../state/features/tags/tags.types";
import { JColourVariants } from "@ben-ryder/jigsaw-react";
import "./tag-form.scss";

export interface TagFormProps {
  content: TagContent;
  onSave: (content: TagContent) => void;
  onDelete?: () => void;
}

export function TagForm(props: TagFormProps) {
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.content.name);
  const [variant, setVariant] = useState<string>(
    props.content.variant || "",
  );

  const tagVariantOptions = useMemo(() => {
    return [
      { text: "-- Select Colour --", value: "" },
      { text: "Teal", value: JColourVariants.teal },
      { text: "Blue Grey", value: JColourVariants.blueGrey },
      { text: "White", value: JColourVariants.white },
      { text: "Red", value: JColourVariants.red },
      { text: "Orange", value: JColourVariants.orange },
      { text: "Yellow", value: JColourVariants.yellow },
      { text: "Green", value: JColourVariants.green },
      { text: "Blue", value: JColourVariants.blue },
      { text: "Purple", value: JColourVariants.purple },
      { text: "Pink", value: JColourVariants.pink },
    ];
  }, [JColourVariants]);

  function onSave() {
    if (name.length === 0) {
      setError("Your note must have a title");
    }
    else {
      setError(null);
      props.onSave({ name, variant: variant as JColourVariants || null });
    }
  }

  return (
    <ContentPage>
      <ContentPageMenu
        backUrl={routes.tags.list}
        backText="Tags"
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

        <ContentPageField modifier="variant">
          <JSelectControl
            id="variant"
            label="Colour"
            options={tagVariantOptions}
            value={variant}
            onChange={setVariant}
          />
        </ContentPageField>

        {name.length > 0 && (
          <ContentPageField modifier="preview">
            <JLabel>Preview</JLabel>
            <JBadge
              text={name}
              variant={variant as JColourVariants || undefined}
            />
          </ContentPageField>
        )}
      </ContentPageContent>
    </ContentPage>
  );
}
