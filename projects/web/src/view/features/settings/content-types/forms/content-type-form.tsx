import { FormEvent, useState } from "react";
import {
  JInput,
  JErrorText,
  JButtonGroup, JButton, JArrowButton, JForm, JFormContent, JFormRow, JTextArea, JProse
} from "@ben-ryder/jigsaw-react";
import {ContentFormProps} from "../../../../common/content-form/content-form";
import {ContentTypeData} from "../../../../../state/schemas/content-types/content-types";
import {ColourVariants} from "../../../../../state/schemas/common/fields";


export function ContentTypeForm(props: ContentFormProps<ContentTypeData>) {
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>(props.data.name);
  const [description, setDescription] = useState<string>(props.data.description || '');
  const [icon, setIcon] = useState<string>(props.data.icon || '');
  const [colour, setColour] = useState<ColourVariants | ''>(props.data.colourVariant || '');

  const [contentTemplateName, setContentTemplateName] = useState<string>(props.data.contentTemplateName || '');
  const [contentTemplateDescription, setContentTemplateDescription] = useState<string>(props.data.contentTemplateDescription || '');
  const [contentTemplateTags, setContentTemplateTags] = useState<string[]>(props.data.contentTemplateTags || []);

  function onSave(e: FormEvent) {
    e.preventDefault()

    const parseResult = ContentTypeData.safeParse({
      name,
      fields: []
    })
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
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="name your content type..."
          />
        </JFormRow>
      </JFormContent>
      <JFormContent>
        <JFormRow>
          <JTextArea
            label="Description"
            id="description"
            value={description}
            rows={3}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="describe what your content type is etc..."
          />
        </JFormRow>
      </JFormContent>
      <JFormContent>
        <JFormRow>
          <JInput
            label="Icon"
            id="icon"
            type="text"
            value={icon}
            onChange={(e) => {
              setIcon(e.target.value);
            }}
            placeholder="notebook,list-todo or wheat etc... "
          />
          <JProse>
            <p>This can be any icon name from <a href="https://lucide.dev/icons/" target="_blank">Lucide Icons</a>.</p>
          </JProse>
        </JFormRow>
      </JFormContent>

      <JFormContent>
        <JFormRow>
          <JInput
            label="Template Name"
            id="templateName"
            type="text"
            value={contentTemplateName}
            onChange={(e) => {
              setContentTemplateName(e.target.value);
            }}
            placeholder="a name template..."
          />
          <JProse>
            <p>Can be used to autogenerate the name of content when created. Use <code>$date</code> for the current date in format <code>YYYY-MM-DD</code>.</p>
          </JProse>
        </JFormRow>
      </JFormContent>
      <JFormContent>
        <JFormRow>
          <JTextArea
            label="Template Description"
            id="templateDescription"
            value={contentTemplateDescription}
            onChange={(e) => {
              setContentTemplateDescription(e.target.value);
            }}
            placeholder="a name template..."
          />
          <JProse>
            <p>Can be used to autogenerate the description of content when created. Use <code>$date</code> for the current date in format <code>YYYY-MM-DD</code>.</p>
          </JProse>
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
