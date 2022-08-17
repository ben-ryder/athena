import {useAthena} from "../../helpers/use-athena";
import React, {useEffect, useState} from "react";
import {NoteDto} from "@ben-ryder/athena-js-lib";
import {ContentCard} from "../../patterns/components/content-card/content-card";
import {Content} from "../../helpers/content-state";
import {useParams} from "react-router-dom";

export interface NotesListProps {
  activeContent: Content | null;
  openAndSwitchContent: (content: Content) => void
}

export function NotesList(props: NotesListProps) {
  const {vaultId} = useParams();

  const {apiClient} = useAthena();
  const [notes, setNotes] = useState<NoteDto[]|null>(null);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  function isNoteActive(note: NoteDto, activeContent: Content | null) {
    let active = false;
    if (activeContent && (activeContent.type === "note-edit" || activeContent.type === "template-edit")) {
      active = activeContent.content.id === note.id
    }
    return active;
  }

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await apiClient.getNotes(vaultId);
        setNotes(response.notes);
      }
      catch (e) {
        console.log(e);
        setErrorMessage("There was an unexpected error loading your notes. Please try again later.")
      }
    }
    loadNotes();
  }, []);

  return (
    <>
      {notes &&
        <>
          {notes.map(note =>
            <ContentCard
              key={note.id}
              content={{type: "note-edit", content: note}}
              active={isNoteActive(note, props.activeContent)}
              openAndSwitchContent={props.openAndSwitchContent}
            />
          )}
          {notes.length === 0 &&
              <div className="m-4">
                  <p className="text-center text-br-whiteGrey-100">0 Notes Found</p>
              </div>
          }
        </>
      }
      {errorMessage &&
          <div className="m-4">
              <p className="text-center text-br-red-500">{errorMessage}</p>
          </div>
      }
    </>
  )
}