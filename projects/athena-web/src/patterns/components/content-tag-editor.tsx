import {TagSelector} from "./tag-selector/tag-selector";
import {useSelector} from "react-redux";
import {selectActiveContent} from "../../main/state/features/ui/content/content-selctors";
import {selectTagOptions} from "../../main/state/features/open-vault/tags/tags-selectors";
import {useState} from "react";

export function ContentTagEditor() {
  const activeContent = useSelector(selectActiveContent);
  const tagOptions = useSelector(selectTagOptions);
  const [tags, setTags] = useState<string[]>([]);

  if (!activeContent) {
    return null;
  }

  return (
    <TagSelector
      id="tag-selector"
      label="Select Content Tags"
      placeholder="Select tags..."
      options={tagOptions}
      currentOptions={tags}
      onOptionsChange={(newTags) => {setTags(newTags)}}
    />
  )
}