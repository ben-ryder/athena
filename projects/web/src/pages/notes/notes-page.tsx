import {useLFBApplication} from "../../utils/lfb-context";
import React, {useMemo} from "react";
import {replaceParam, routes} from "../../routes";
import {Helmet} from "react-helmet-async";
import {ContentList} from "../../patterns/layout/content-list/content-list";
import {ContentItem} from "../../patterns/layout/content-list/content-card";

export function NotesPage() {
  const {document} = useLFBApplication();

  const noteContentItems: ContentItem[] = useMemo(() => {
    const notes = document.notes.content.ids.map(id => document.notes.content.entities[id]);

    return notes.map(note => {
      return {
        id: note.id,
        name: note.name,
        teaser: note.body.substring(0, 100),
        url: replaceParam(routes.content.notes.edit, "noteId", note.id)
      }
    })
  }, [document]);

  function onDelete(ids: string[]) {
    console.log(`deleting ${ids}`);
  }

  return (
    <>
      <Helmet>
        <title>Notes | Athena</title>
      </Helmet>
      <ContentList
        items={noteContentItems}
        title="Notes"
        newUrl={routes.content.notes.create}
        newText="New Note"
        onDelete={onDelete}
      />
    </>
  )
}
