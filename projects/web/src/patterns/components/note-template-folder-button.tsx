import {
  DatabaseNoteTemplate
} from "../../state/features/current-vault/note-templates/note-templates-interface";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {selectFoldersState} from "../../state/features/current-vault/folders/folders-selectors";
import {openNoteTemplateFolderModal} from "../../state/features/ui/modals/modals-actions";

export interface NoteTemplateFolderButtonProps {
  noteTemplate: DatabaseNoteTemplate
}

export function NoteTemplateFolderButton(props: NoteTemplateFolderButtonProps) {
  const dispatch = useAppDispatch();
  const folders = useAppSelector(selectFoldersState);
  const text = props.noteTemplate.targetFolderId !== null
    ? folders.entities[props.noteTemplate.targetFolderId].name
    : "No Target Folder"

  return (
    <button
      className="bg-br-atom-900 px-2 whitespace-nowrap mx-2 text-br-whiteGrey-200 border border-br-blueGrey-600"
      onClick={() => {
        dispatch(openNoteTemplateFolderModal(props.noteTemplate))
      }}
    >{text}</button>
  )
}