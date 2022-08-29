import React from "react";
import {NoteCard} from "./content-card/content-card";
import {selectActiveContent} from "../../main/state/features/ui/content/content-selctors";
import {selectNoteList} from "../../main/state/features/open-vault/notes/notes-selectors";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../main/state/store";
import {ContentType} from "../../main/state/features/ui/content/content-interface";


export function ContentList() {
  const activeContent = useSelector(selectActiveContent);
  const notes = useSelector(selectNoteList);

  return (
    <div className="mx-4 mt-4">
      {notes.map(noteId =>
        <NoteCard
          key={noteId}
          noteId={noteId}
          active={activeContent?.type === ContentType.NOTE && activeContent.data.id === noteId}
        />
      )}
      {notes.length === 0 &&
          <div className="mx-4">
              <p className="text-center text-br-whiteGrey-100">No Content Found</p>
          </div>
      }
    </div>
  )
}
