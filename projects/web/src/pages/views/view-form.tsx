import { useMemo, useState } from "react";
import {
  JErrorText,
  JInputControl,
  JMultiSelectControl,
  JMultiSelectOptionData,
  JOptionData,
  JSelectControl
} from "@ben-ryder/jigsaw-react";
import { routes } from "../../routes";
import {
  ContentPage,
  ContentPageContent,
  ContentPageField,
  ContentPageMenu
} from "../../patterns/layout/content-page/content-page";
import {
  ViewContent,
  ViewContentTypes,
  ViewOrderByFields,
  ViewOrderDirection
} from "../../state/features/database/views";
import { useLFBApplication } from "../../utils/lfb-context";

export interface ViewFormProps {
  content: ViewContent;
  onSave: (content: ViewContent) => void;
  onDelete?: () => void;
}

export function ViewForm(props: ViewFormProps) {
  const { document } = useLFBApplication();

  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.content.name);

  const contentTypeOptions: JOptionData[] = [
    {
      text: "Notes",
      value: ViewContentTypes.NOTES
    },
    {
      text: "Tasks",
      value: ViewContentTypes.TASKS
    }
  ];
  const [contentType, setContentType] = useState<ViewContentTypes>(props.content.contentType);

  const [selectedTags, setSelectedTags] = useState<JMultiSelectOptionData[]>(
    props.content.tags.map((tagId) => {
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

  const orderByOptions: JOptionData[] = [
    {
      text: "Name",
      value: ViewOrderByFields.NAME
    },
    {
      text: "Updated At",
      value: ViewOrderByFields.UPDATED_AT
    },
    {
      text: "Created At",
      value: ViewOrderByFields.CREATED_AT
    },
  ];
  const [orderBy, setOrderBy] = useState<ViewOrderByFields>(props.content.orderBy);

  const orderDirectionOptions: JOptionData[] = [
    {
      text: "DESC",
      value: ViewOrderDirection.DESC
    },
    {
      text: "ASC",
      value: ViewOrderDirection.ASC
    }
  ];
  const [orderDirection, setOrderDirection] = useState<ViewOrderDirection>(props.content.orderDirection);

  const [limit, setLimit] = useState<number>(props.content.limit);

  function onSave() {
    if (name.length === 0) {
      setError("Your note must have a title");
    } else {
      setError(null);

      props.onSave({
        name,
        tags: selectedTags.map(option => option.value),
        contentType: contentType,
        orderBy: orderBy,
        orderDirection: orderDirection,
        limit: limit
      });
    }
  }

  return (
    <ContentPage>
      <ContentPageMenu
        backUrl={routes.views.list}
        backText="Views"
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
            placeholder="a name..."
          />
        </ContentPageField>

        <ContentPageField modifier="contentType">
          <JSelectControl
            label="Content Type"
            id="contentType"
            value={contentType}
            options={contentTypeOptions}
            onChange={v => setContentType(v)}
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

        <ContentPageField modifier="orderBy">
          <JSelectControl
            label="Order By"
            id="orderBy"
            value={orderBy}
            options={orderByOptions}
            onChange={v => setOrderBy(v)}
          />
        </ContentPageField>

        <ContentPageField modifier="orderDirection">
          <JSelectControl
            label="Order Direction"
            id="orderDirection"
            value={orderDirection}
            options={orderDirectionOptions}
            onChange={v => setOrderDirection(v)}
          />
        </ContentPageField>

        <ContentPageField modifier="limit">
          <JInputControl
            label="Limit"
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
            }}
          />
        </ContentPageField>

      </ContentPageContent>
    </ContentPage>
  );
}
