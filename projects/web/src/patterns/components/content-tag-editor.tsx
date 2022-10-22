import {TagMultiSelect} from "./tag-selector/tag-multi-select";
import {useSelector} from "react-redux";
import {selectActiveContent} from "../../state/features/ui/content/content-selctors";
import {ContentType} from "../../state/features/ui/content/content-interface";
import {Option} from "@ben-ryder/jigsaw";
import {ApplicationState, useAppDispatch} from "../../state/store";
import {selectTagOptions} from "../../state/features/document/tags/tags-selectors";
import {selectNoteTags} from "../../state/features/document/notes-tags/notes-tags-selectors";
import {updateNoteTags} from "../../state/features/document/notes/notes-thunks";
import {selectNoteTemplateTags} from "../../state/features/document/note-templates-tags/note-template-tags-selectors";
import {updateNoteTemplateTags} from "../../state/features/document/note-templates/note-templates-thunks";
import {selectTaskListTags} from "../../state/features/document/task-list-tags/task-list-tags-selectors";
import {updateTaskListTags} from "../../state/features/document/task-lists/task-lists-thunks";

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
  else if (activeContent.type === ContentType.NOTE_TEMPLATE) {
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
      currentOptions={noteTags.map(noteTag => noteTag.id)}
      onOptionsChange={(newTags) => {
        dispatch(updateNoteTags(props.contentId, newTags))
      }}
    />
  )
}

export function TemplateTagsEditor(props: TagsEditorProps) {
  const dispatch = useAppDispatch();
  const templateTags = useSelector((state: ApplicationState) => selectNoteTemplateTags(state, props.contentId));

  return (
    <TagMultiSelect
      id="tag-selector"
      label="Select Content Tags"
      placeholder="Select tags..."
      options={props.tagOptions}
      currentOptions={templateTags.map(templateTag => templateTag.id)}
      onOptionsChange={(newTags) => {
        dispatch(updateNoteTemplateTags(props.contentId, newTags))
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
      currentOptions={taskListTags.map(taskListTag => taskListTag.id)}
      onOptionsChange={(newTags) => {
        dispatch(updateTaskListTags(props.contentId, newTags))
      }}
    />
  )
}