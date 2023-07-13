import {AthenaDatabase} from "../../state/features/database/athena-database";
import {useLFBApplication} from "../../utils/lfb-context";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "../../routes";
import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {TagContent, TagEntity } from "../../state/features/database/tag";
import { TagForm } from "./tag-form";

export function EditTagPage() {
  const navigate = useNavigate();
  const params = useParams();
  const {makeChange, document} = useLFBApplication();

  const [tag, setTag] = useState<TagEntity|null>();
  const [error, setError] = useState<string|null>();


  useEffect(() => {
    // Reset error
    setError(null);

    if (!params.id) {
      return navigate(routes.organisation.tags.list);
    }

    const tag = document.tags.content.entities[params.id];
    if (!tag) {
      setError("The tag could not be found");
      setTag(null);
    }
    else {
      setTag(tag);
    }
  }, [document, setTag]);

  async function onSave(updatedContent: TagContent) {
    if (!tag) {
      return setError("Tried to save a tag that isn't loaded yet.")
    }

    await makeChange((doc: AthenaDatabase) => {
      const timestamp = new Date().toISOString();

      // check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      if (doc.tags.content.entities[tag.id].name !== updatedContent.name) {
        doc.tags.content.entities[tag.id].name = updatedContent.name;
      }
      if (doc.tags.content.entities[tag.id].variant !== updatedContent.variant) {
        doc.tags.content.entities[tag.id].variant = updatedContent.variant;
      }

      doc.tags.content.entities[tag.id].updatedAt = timestamp;
    });

    navigate(routes.organisation.tags.list);
  }

  async function onDelete() {
    if (!tag) {
      return setError("Tried to delete a tag that isn't loaded yet.")
    }

    await makeChange((doc: AthenaDatabase) => {
      doc.tags.content.ids = doc.tags.content.ids.filter(id => id !== tag.id);
      delete doc.tags.content.entities[tag.id];
    });

    navigate(routes.organisation.tags.list);
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
            variant: tag.variant
          }}
          onSave={onSave}
          onDelete={onDelete}
        />
      </div>
    )
  }

  return null;
}
