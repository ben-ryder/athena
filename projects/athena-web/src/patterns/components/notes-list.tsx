import React from "react";
import {NoteCard} from "./content-card/content-card";
import {selectActiveContent} from "../../main/state/features/ui/ui-selctors";
import {selectNoteList} from "../../main/state/features/open-vault/notes/notes-selectors";
import {useSelector} from "react-redux";


export function NotesList() {
  const activeContent = useSelector(selectActiveContent);
  const notes = useSelector(selectNoteList);

  return (
    <>
      {notes.map(note =>
        <NoteCard
          key={note.id}
          note={note}
          active={activeContent !== null && activeContent.data.id === note.id}
        />
      )}
      {notes.length === 0 &&
          <div className="m-4">
              <p className="text-center text-br-whiteGrey-100">0 Notes Found</p>
          </div>
      }
    </>
  )
}
