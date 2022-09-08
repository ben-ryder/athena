import {colourPalette, IconButton, iconColorClassNames, iconSizes, Tag as TagComponent} from "@ben-ryder/jigsaw";
import React, {useState} from "react";
import {Tag} from "../../main/state/features/open-vault/open-vault-interfaces";
import {Pencil as EditIcon, Trash as DeleteIcon} from "lucide-react";
import {TagForm} from "./tag-form";
import {updateTag} from "../../main/state/features/open-vault/tags/tags-actions";
import {useAppDispatch} from "../../main/state/store";
import {openDeleteContentModal, openDeleteTagModal} from "../../main/state/features/ui/modals/modals-actions";

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
                bgColor={props.tag.backgroundColour || colourPalette.teal["600"]}
                fgColor={props.tag.textColour || colourPalette.whiteGrey["50"]}
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
              dispatch(updateTag({
                id: props.tag.id,
                name: tagFields.name,
                backgroundColour: tagFields.backgroundColour,
                textColour: tagFields.textColour,
                createdAt: props.tag.createdAt,
                updatedAt: new Date().toISOString()
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