import React, {useState} from "react";
import {Button, colourPalette, Input, Label, Tag as TagComponent} from "@ben-ryder/jigsaw";
import {Tag} from "../../state/features/current-vault/tags/tags-interface";

export interface TagFormFields {
  name: string,
  backgroundColour: string,
  textColour: string
}

export interface TagFormProps {
  tag?: Tag;
  onSubmit: (fields: TagFormFields) => void;
  onCancel: () => void;
  submitText: string;
}

export function TagForm(props: TagFormProps) {
  const [name, setName] = useState(props.tag?.name || "");
  const [backgroundColour, setBackgroundColour] = useState(props.tag?.backgroundColour || "");
  const [textColour, setTextColour] = useState(props.tag?.textColour || "");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();

      props.onSubmit({
        name,
        backgroundColour,
        textColour
      })
    }}>
      <Input id="new-tag-name" label="Name" type="text" value={name} onChange={(e) => {setName(e.target.value)}} />

      <div className="flex mt-3">
        <div className="w-full">
          <Input className="h-[40px]" id="new-tag-background-colour" label="Background Colour" type="color" value={backgroundColour} onChange={(e) => {setBackgroundColour(e.target.value)}} />
        </div>
        <div className="ml-2 w-full">
          <Input className="h-[40px]" id="new-tag-text-colour" label="Text Colour" type="color" value={textColour} onChange={(e) => {setTextColour(e.target.value)}} />
        </div>
      </div>
      <div className="mt-4">
        <p className="font-bold text-br-whiteGrey-100">Preview</p>
        <TagComponent
          text={name}
          backgroundColour={backgroundColour || colourPalette.teal["600"]}
          textColour={textColour || colourPalette.whiteGrey["50"]}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button" onClick={() => {
            setBackgroundColour("");
            setTextColour("");
        }}
          className="underline mr-auto text-br-whiteGrey-100 hover:text-br-teal-600"
        >reset colours</button>
        <Button type="button" styling="secondary" onClick={props.onCancel}>Cancel</Button>
        <Button type="submit" className="ml-2">{props.submitText}</Button>
      </div>
    </form>
  )
}