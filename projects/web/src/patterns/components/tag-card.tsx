import {colourPalette, IconButton, iconColorClassNames, iconSizes, Tag as TagComponent} from "@ben-ryder/jigsaw";
import React, {useState} from "react";
import {Pencil as EditIcon, Trash as DeleteIcon} from "lucide-react";
import {TagForm} from "./tag-form";
import {useAppDispatch} from "../../state/store";
import {openDeleteTagModal} from "../../state/features/ui/modals/modals-actions";
import {Tag} from "../../state/features/document/document-interface";
import {updateTag} from "../../state/features/document/tags/tags-thunks";

export interface TagCardProps {
  tag: Tag
}

export function TagCard(props: TagCardProps) {
  const dispatch = useAppDispatch();
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  return (
    <div className="bg-br-atom-700 p-4 m-4">
      {!showEditForm &&
        <div className="flex items-center">
            <TagComponent
                className="mr-auto"
                text={props.tag.name}
                backgroundColour={props.tag.backgroundColour || colourPalette.teal["600"]}
                textColour={props.tag.textColour || colourPalette.whiteGrey["50"]}
            />
            <IconButton
                label={`Delete tag ${props.tag.name}`}
                icon={<DeleteIcon size={iconSizes.small} className={iconColorClassNames.secondary} />}
                onClick={() => {dispatch(openDeleteTagModal(props.tag))}}
            />
            <IconButton
                label={`Edit tag ${props.tag.name}`}
                icon={<EditIcon size={iconSizes.small} className={iconColorClassNames.secondary} />}
                className="ml-4"
                onClick={() => {setShowEditForm(true)}}
            />
        </div>
      }
      {showEditForm &&
        <TagForm
            tag={props.tag}
            onSubmit={(tagFields => {
              dispatch(updateTag(props.tag.id, {
                name: tagFields.name,
                backgroundColour: tagFields.backgroundColour,
                textColour: tagFields.textColour,
              }))
              setShowEditForm(false);
            })}
            onCancel={() => {setShowEditForm(false)}}
            submitText="Save"
        />
      }
    </div>
  )
}