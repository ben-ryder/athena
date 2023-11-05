import { AthenaDatabase } from "../../state/features/database/athena-database";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TagContent, TagEntity } from "../../state/features/database/tag";
import { TagForm } from "./tag-form/tag-form";

export function EditTagPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { makeChange, document } = useLFBApplication();

  const [tag, setTag] = useState<TagEntity | null>();
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.tags.list);
    }

    const tag = document.tags.content.entities[params.id];
    if (!tag) {
      setError("The tag could not be found");
      setTag(null);
    } else {
      setTag(tag);
    }
  }, [document, setTag]);

  async function onSave(updatedContent: TagContent) {
    if (!tag) {
      return setError("Tried to save a tag that isn't loaded yet.");
    }

    await makeChange((doc: AthenaDatabase) => {
      const timestamp = new Date().toISOString();

      // check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      if (doc.tags.content.entities[tag.id].name !== updatedContent.name) {
        doc.tags.content.entities[tag.id].name = updatedContent.name;
      }
      if (
        doc.tags.content.entities[tag.id].variant !== updatedContent.variant
      ) {
        doc.tags.content.entities[tag.id].variant = updatedContent.variant;
      }

      doc.tags.content.entities[tag.id].updatedAt = timestamp;
    });

    navigate(routes.tags.list);
  }

  async function onDelete() {
    if (!tag) {
      return setError("Tried to delete a tag that isn't loaded yet.");
    }

    // todo: I should use deleteAt instead here. ref https://automerge.org/docs/documents/lists/.
    await makeChange((doc: AthenaDatabase) => {
      // Delete from tags
      doc.tags.content.ids = doc.tags.content.ids.filter((id) => id !== tag.id);
      delete doc.tags.content.entities[tag.id];

      // Remove from all content
      for (const noteId of doc.notes.content.ids) {
        if (doc.notes.content.entities[noteId].tags.includes(tag.id)) {
          doc.notes.content.entities[noteId].tags = doc.notes.content.entities[noteId].tags.filter((tagId) => tagId !== tag.id)
        }
      }
      for (const noteListId of doc.notes.lists.ids) {
        if (doc.notes.lists.entities[noteListId].tags.includes(tag.id)) {
          doc.notes.lists.entities[noteListId].tags = doc.notes.lists.entities[noteListId].tags.filter((tagId) => tagId !== tag.id)
        }
      }
      for (const taskId of doc.tasks.content.ids) {
        if (doc.tasks.content.entities[taskId].tags.includes(tag.id)) {
          doc.tasks.content.entities[taskId].tags = doc.tasks.content.entities[taskId].tags.filter((tagId) => tagId !== tag.id)
        }
      }
      for (const taskListId of doc.tasks.lists.ids) {
        if (doc.tasks.lists.entities[taskListId].tags.includes(tag.id)) {
          doc.tasks.lists.entities[taskListId].tags = doc.tasks.lists.entities[taskListId].tags.filter((tagId) => tagId !== tag.id)
        }
      }
    });

    navigate(routes.tags.list);
  }

  if (tag) {
    return (
      <div>
        <Helmet>
          <title>{`${tag.name} | Tags | Athena`}</title>
        </Helmet>
        <TagForm
          content={{
            name: tag.name,
            variant: tag.variant,
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return null;
}
