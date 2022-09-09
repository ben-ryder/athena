import {TagMultiSelect} from "./tag-selector/tag-multi-select";
import {useSelector} from "react-redux";
import {selectActiveContent} from "../../main/state/features/ui/content/content-selctors";
import {selectTagOptions} from "../../main/state/features/open-vault/tags/tags-selectors";
import {selectNoteTags} from "../../main/state/features/open-vault/notes-tags/notes-tags-selectors";
import {ApplicationState} from "../../main/state/state-interface";
import {ContentType} from "../../main/state/features/ui/content/content-interface";
import {Option} from "@ben-ryder/jigsaw";
import {useAppDispatch} from "../../main/state/store";
import {updateNoteTags} from "../../main/state/features/open-vault/notes/notes-actions";
import {selectTemplateTags} from "../../main/state/features/open-vault/templates-tags/templates-tags-selectors";
import {updateTemplateTags} from "../../main/state/features/open-vault/templates/templates-actions";
import {updateTaskListTags} from "../../main/state/features/open-vault/task-lists/task-lists-actions";
import {selectTaskListTags} from "../../main/state/features/open-vault/task-lists-tags/task-lists-tags-selectors";

export interface TagsEditorProps {
  contentId: string,
  tagOptions: Option[]
}


export function ContentTagEditor() {
  const activeContent = useSelector(selectActiveContent);
  const tagOptions = useSelector(selectTagOptions);

  if (!activeContent) {
    return null;
  }

  if (activeContent.type === ContentType.NOTE) {
    return (
      <NoteTagsEditor contentId={activeContent.data.id} tagOptions={tagOptions} />
    )
  }
  else if (activeContent.type === ContentType.TEMPLATE) {
    return (
      <TemplateTagsEditor contentId={activeContent.data.id} tagOptions={tagOptions} />
    )
  }
  else {
    return (
      <TaskListTagsEditor contentId={activeContent.data.id} tagOptions={tagOptions} />
    )
  }
}

export function NoteTagsEditor(props: TagsEditorProps) {
  const dispatch = useAppDispatch();
  const noteTags = useSelector((state: ApplicationState) => selectNoteTags(state, props.contentId));

  return (
    <TagMultiSelect
      id="tag-selector"
      label="Select Content Tags"
      placeholder="Select tags..."
      options={props.tagOptions}
      currentOptions={noteTags.map(noteTag => noteTag.tagId)}
      onOptionsChange={(newTags) => {
        dispatch(updateNoteTags({
          id: props.contentId,
          tags: newTags
        }))
      }}
    />
  )
}

export function TemplateTagsEditor(props: TagsEditorProps) {
  const dispatch = useAppDispatch();
  const templateTags = useSelector((state: ApplicationState) => selectTemplateTags(state, props.contentId));

  return (
    <TagMultiSelect
      id="tag-selector"
      label="Select Content Tags"
      placeholder="Select tags..."
      options={props.tagOptions}
      currentOptions={templateTags.map(templateTag => templateTag.tagId)}
      onOptionsChange={(newTags) => {
        dispatch(updateTemplateTags({
          id: props.contentId,
          tags: newTags
        }))
      }}
    />
  )
}

export function TaskListTagsEditor(props: TagsEditorProps) {
  const dispatch = useAppDispatch();
  const taskListTags = useSelector((state: ApplicationState) => selectTaskListTags(state, props.contentId));

  return (
    <TagMultiSelect
      id="tag-selector"
      label="Select Content Tags"
      placeholder="Select tags..."
      options={props.tagOptions}
      currentOptions={taskListTags.map(taskListTag => taskListTag.tagId)}
      onOptionsChange={(newTags) => {
        dispatch(updateTaskListTags({
          id: props.contentId,
          tags: newTags
        }))
      }}
    />
  )
}