import { useMemo, useState } from "react";
import { Editor } from "../../patterns/components/editor/editor";
import {
  JInput,
  JLabel,
  JErrorText,
  JMultiSelect,
  JMultiSelectOptionData
} from "@ben-ryder/jigsaw-react";
import { routes } from "../../routes";
import {
  ContentPage,
  ContentPageContent,
  ContentPageField,
  ContentPageMenu,
} from "../../patterns/layout/content-page/content-page";
import { ItemContent } from "../../state/database/items/items";
import { useLFBApplication } from "../../utils/lfb-context";
import { getAllTags } from "../../state/database/tags/tags.selectors";

export interface ItemFormProps {
  itemContent: ItemContent;
  onSave: (itemContent: ItemContent) => void;
  onDelete?: () => void;
}

export function ItemForm(props: ItemFormProps) {
  const { document: db } = useLFBApplication();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.itemContent.name);
  const [body, setBody] = useState<string>(props.itemContent.body);

  const [selectedTags, setSelectedTags] = useState<JMultiSelectOptionData[]>(
    props.itemContent.tags.map((tagId) => {
      const tag = db.tags.entities[tagId];

      return {
        text: tag.name,
        value: tag.id,
        variant: tag.variant || undefined,
      };
    }),
  );

  const tagOptions: JMultiSelectOptionData[] = useMemo(() => {
    const tags = getAllTags(db)

    return tags.map((tag) => {
      return {
        text: tag.name,
        value: tag.id,
        variant: tag.variant || undefined,
      };
    });
  }, [db.tags.ids]);

  function onSave() {
    if (name.length === 0) {
      setError("Your item must have a title");
    } else {
      setError(null);

      const tags = selectedTags.map((tagOption) => tagOption.value);
      props.onSave({ name, body, tags: tags });
    }
  }

  return (
    <ContentPage>
      <ContentPageMenu
        backUrl={routes.items.list}
        backText="Items"
        onSave={onSave}
        onDelete={props.onDelete}
      />

      {error && <JErrorText>{error}</JErrorText>}

      <ContentPageContent>
        <ContentPageField modifier="name">
          <JInput
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="an item name..."
          />
        </ContentPageField>

        <ContentPageField modifier="tags">
          <JMultiSelect
            id="tags"
            label="Tags"
            options={tagOptions}
            selectedOptions={selectedTags}
            setSelectedOptions={setSelectedTags}
            searchText="search & select tags..."
            noOptionsText="No tags found"
          />
        </ContentPageField>

        <ContentPageField modifier="body">
          <JLabel htmlFor="item-body">Body</JLabel>
          <Editor
            id="item-body"
            value={body}
            onChange={(updatedBody) => setBody(updatedBody)}
          />
        </ContentPageField>
      </ContentPageContent>
    </ContentPage>
  );
}
