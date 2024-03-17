import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  JInput,
  JButtonGroup,
  JButton,
  JArrowButton,
  JForm,
  JFormContent,
  JFormRow,
  JTextArea,
  JProse,
  JMultiSelectOptionData,
  JOptionData, JColourVariants, JSelect, JMultiSelect
} from "@ben-ryder/jigsaw-react";
import {ContentFormProps} from "../../../../common/content-form/content-form";
import {
  ContentTypeData
} from "../../../../../state/schemas/content-types/content-types";
import {ColourVariants} from "../../../../../state/schemas/common/fields";
import { ErrorObject, QueryStatus } from "@localful-athena/control-flow";
import { FIELD_TYPES } from "../../../../../state/schemas/fields/field-types";
import { ErrorCallout } from "../../../../patterns/components/error-callout/error-callout";
import { useObservableQuery } from "@localful-athena/react/use-observable-query";
import { localful } from "../../../../../state/athena-localful";

export function ContentTypeForm(props: ContentFormProps<ContentTypeData>) {
  const [errors, setErrors] = useState<ErrorObject[]>([]);

  const [name, setName] = useState<string>(props.data.name);
  const [description, setDescription] = useState<string>(props.data.description || '');
  const [icon, setIcon] = useState<string>(props.data.icon || '');

  const [contentTemplateTags, setContentTemplateTags] = useState<JMultiSelectOptionData[]>([]);
  const allTags = useObservableQuery(localful.db.observableQuery('tags'))
  const tagOptions: JMultiSelectOptionData[] = allTags.status === QueryStatus.SUCCESS
    ? allTags.data.map(tag => ({
      text: tag.data.name,
      value: tag.id,
      variant: tag.data.colourVariant
    }))
    : []

  useEffect(() => {
    async function loadSelectedTags() {
      if (props.data.contentTemplateTags && props.data.contentTemplateTags.length > 0) {
        const selectedTags = await localful.db.getMany('tags', props.data.contentTemplateTags)
        if (!selectedTags.success) {
          setErrors((e) => {return [...e, ...selectedTags.errors]})
        }
        else {
          setContentTemplateTags(selectedTags.data.map(tag => ({
              text: tag.data.name,
              value: tag.id,
              variant: tag.data.colourVariant
            }))
          )

          if (Array.isArray(selectedTags.errors) && selectedTags.errors.length > 0) {
            setErrors((e) => {return [...e, ...selectedTags.errors as ErrorObject[]]})
          }
        }
      }
    }
    loadSelectedTags()
  }, [])

  const [colour, setColour] = useState<ColourVariants | ''>(props.data.colourVariant || '');
  const colourVariantOptions: JOptionData[] = useMemo(() => {
    return [
      { text: "-- Select Colour --", value: "" },
      ...ColourVariants.options.map((variant) => ({
        // todo: replace with generic labels, not direct from Jigsaw
        text: JColourVariants[variant].label,
        value: variant
      }))
    ];
  }, []);

  const [contentTemplateName, setContentTemplateName] = useState<string>(props.data.contentTemplateName || '');
  const [contentTemplateDescription, setContentTemplateDescription] = useState<string>(props.data.contentTemplateDescription || '');

  const [fieldOptions, setFieldOptions] = useState<JMultiSelectOptionData[]>([]);
  const allFields = useObservableQuery(localful.db.observableQuery('fields'))
  useEffect(() => {
    if (allFields.status === QueryStatus.SUCCESS) {
      const fieldOptionMappings: JMultiSelectOptionData[] = allFields.status === QueryStatus.SUCCESS
        ? allFields.data.map(field => ({
          text: `${field.data.label} (${FIELD_TYPES[field.data.type].label})`,
          value: field.id,
        }))
        : []
      setFieldOptions(fieldOptionMappings)
    }
  }, [allFields])

  const [selectedFields, setSelectedFields] = useState<JMultiSelectOptionData[]>([]);
  useEffect(() => {
    async function loadSelectedFields() {
      if (props.data.fields && props.data.fields.length > 0) {
        const selectedFields = await localful.db.getMany('fields', props.data.fields)
        if (!selectedFields.success) {
          setErrors((e) => {return [...e, ...selectedFields.errors]})
        }
        else {
          setSelectedFields(selectedFields.data.map(field => ({
              text: `${field.data.label} (${FIELD_TYPES[field.data.type].label})`,
              value: field.id,
            }))
          )

          if (Array.isArray(selectedFields.errors) && selectedFields.errors.length > 0) {
            setErrors((e) => {return [...e, ...selectedFields.errors as ErrorObject[]]})
          }
        }
      }
    }
    loadSelectedFields()
  }, [])


  function onSave(e: FormEvent) {
    e.preventDefault()

    const parseResult = ContentTypeData.safeParse({
      name,
      description,
      icon: icon || undefined,
      colourVariant: colour || undefined,
      contentTemplateName: contentTemplateName || undefined,
      contentTemplateDescription: contentTemplateDescription || undefined,
      contentTemplateTags: contentTemplateTags.map(t => t.value),
      fields: selectedFields.map(f => f.value)
    } as ContentTypeData)
    if (!parseResult.success) {
      console.error(parseResult.error)
      return
    }

    setErrors([]);
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
        {errors.length > 0 && <ErrorCallout errors={errors} />}
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
        <JFormRow>
          <JSelect
            id="variant"
            label="Colour"
            options={colourVariantOptions}
            value={colour}
            onChange={(e) => {setColour(e.target.value as ColourVariants|"")}}
          />
        </JFormRow>
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
        <JFormRow>
          <JMultiSelect
            id="templateTags"
            label="Template Tags"
            options={tagOptions}
            selectedOptions={contentTemplateTags}
            setSelectedOptions={setContentTemplateTags}
            searchText="Search and select tags..."
            noOptionsText="No Tags Found"
          />
        </JFormRow>
        <JFormRow>
          <JMultiSelect
            id="fields"
            label="Fields"
            options={fieldOptions}
            selectedOptions={selectedFields}
            setSelectedOptions={setSelectedFields}
            searchText="Search and select fields..."
            noOptionsText="No Fields Found"
          />
          <JProse>
            <p>Fields will be ordered as they are selected here.</p>
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
