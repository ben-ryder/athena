import {useState} from "react";
import {JInputControl, JLabel, JContentSection, JErrorText} from "@ben-ryder/jigsaw-react";
import {routes} from "../../routes";
import {
  ContentPage,
  ContentPageContent,
  ContentPageField,
  ContentPageMenu
} from "../../patterns/layout/content-page/content-page";
import {TagContent} from "../../state/features/database/tag";


export interface TagFormProps {
  content: TagContent,
  onSave: (content: TagContent) => void,
  onDelete?: () => void
}

export function TagForm(props: TagFormProps) {
  const [error, setError] = useState<string|null>(null);

  const [name, setName] = useState<string>(props.content.name);
  const [textColour, setTextColour] = useState<string>(props.content.textColour);
  const [backgroundColour, setBackgroundColour] = useState<string>(props.content.backgroundColour);

  function onSave() {
    if (name.length === 0) {
      setError("Your note must have a title");
    }
    else {
      setError(null);
      props.onSave({name, textColour, backgroundColour});
    }
  }

  return (
    <ContentPage>

      <ContentPageMenu
        backUrl={routes.organisation.tags.list}
        backText="Tags"
        onSave={onSave}
        onDelete={props.onDelete}
      />

      {error &&
          <JErrorText>{error}</JErrorText>
      }

      <ContentPageContent>

        <ContentPageField modifier="name">
          <JInputControl
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={e => {setName(e.target.value)}}
            placeholder="a note title..."
          />
        </ContentPageField>

        <ContentPageField modifier="backgroundColour">
          <JInputControl
            label="Background Colour"
            id="backgroundColour"
            type="color"
            value={backgroundColour}
            onChange={e => {setBackgroundColour(e.target.value)}}
            placeholder="a colour hex code..."
          />
        </ContentPageField>

        <ContentPageField modifier="textColour">
          <JInputControl
            label="Text Colour"
            id="textColour"
            type="color"
            value={textColour}
            onChange={e => {setTextColour(e.target.value)}}
            placeholder="a colour hex code..."
          />
        </ContentPageField>
      </ContentPageContent>

    </ContentPage>
  )
}
