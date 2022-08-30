import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {Plus as AddContentIcon} from "lucide-react";
import React from "react";
import {createNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {v4 as createUUID} from "uuid";
import {useAppDispatch} from "../../../main/state/store";
import {IconWithMenuPopup} from "./icon-with-popup";
import {createTemplate} from "../../../main/state/features/open-vault/templates/templates-actions";

export function CreateContentIconAndPopup() {
  const dispatch = useAppDispatch();

  return (
    <IconWithMenuPopup
      label="Create Content"
      icon={
        <AddContentIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary} />
      }
      menuItems={[
        {
          label: "Note",
          action: () => {
            dispatch(createNote({
              id: createUUID(),
              name: "untitled",
              body: "",
              folderId: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }))
          }
        },
        {
          label: "From Template",
          action: () => {}
        },
        {
          label: "Template",
          action: () => {
            dispatch(createTemplate({
              id: createUUID(),
              name: "untitled",
              body: "",
              folderId: null,
              targetFolderId: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }))
          }
        },
        {
          label: "Task List",
          action: () => {}
        }
      ]}
    />
  )
}
