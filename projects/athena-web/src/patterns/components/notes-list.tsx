import React from "react";
import {NoteCard} from "./content-card/content-card";
import {selectActiveContent} from "../../main/state/features/ui/ui-selctors";
import {selectNotes} from "../../main/state/features/open-vault/notes/notes-selectors";
import {useSelector} from "react-redux";
import {Button} from "@ben-ryder/jigsaw";
import {useAppDispatch} from "../../main/state/store";
import {createNote} from "../../main/state/features/open-vault/notes/notes-actions";
import {v4 as createUUID} from "uuid";


export function NotesList() {
  const dispatch = useAppDispatch();

  const activeContent = useSelector(selectActiveContent);
  const notes = useSelector(selectNotes);

  return (
    <>
      <div className="p-4 flex justify-end">
        <Button onClick={() => {
          dispatch(createNote({
            id: createUUID(),
            name: "untitled",
            body: "",
            folderId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
        }}>New Note</Button>
      </div>
      <div className="mx-4">
        {notes.map(note =>
          <NoteCard
            key={note.id}
            note={note}
            active={activeContent !== null && activeContent.data.id === note.id}
          />
        )}
        {notes.length === 0 &&
            <div className="mx-4">
                <p className="text-center text-br-whiteGrey-100">0 Notes Found</p>
            </div>
        }
      </div>
    </>
  )
}
