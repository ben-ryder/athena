import React, {useEffect, useState} from "react";
import {NoteDto} from "@ben-ryder/athena-js-lib";
import {ContentCard} from "../../patterns/components/content-card/content-card";
import {Content, ContentType} from "../../helpers/content-state";
import {useParams} from "react-router-dom";

export interface NotesListProps {
  notes: NoteDto[]|null,
  setNotes: (notes: NoteDto[]|null) => void,
  activeContent: Content | null;
  openContent: (content: Content) => void
}

export function NotesList(props: NotesListProps) {
  const {vaultId} = useParams();
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  function isNoteActive(note: NoteDto, activeContent: Content | null) {
    let active = false;
    if (activeContent && (activeContent.type === ContentType.NOTE_EDIT || activeContent.type === ContentType.TEMPLATE_EDIT)) {
      active = activeContent.content.id === note.id
    }
    return active;
  }

  return (
    <>
      {props.notes &&
        <>
          {props.notes.map(note =>
            <ContentCard
              key={note.id}
              content={{type: ContentType.NOTE_EDIT, content: note}}
              active={isNoteActive(note, props.activeContent)}
              openContent={props.openContent}
            />
          )}
          {props.notes.length === 0 &&
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