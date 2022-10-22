import {ContentType} from "../../../state/features/ui/content/content-interface";
import {useSelector} from "react-redux";
import {Tag as TagElement} from "@ben-ryder/jigsaw";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {ApplicationState} from "../../../state/store";
import {selectNoteTags} from "../../../state/features/document/notes-tags/notes-tags-selectors";
import {
  selectNoteTemplateTags
} from "../../../state/features/document/note-templates-tags/note-template-tags-selectors";
import {selectTaskListTags} from "../../../state/features/document/task-list-tags/task-list-tags-selectors";
import {Tag} from "../../../state/features/document/document-interface";

export interface ContentTagsProps {
  content: ContentData
}

export function ContentTags(props: ContentTagsProps) {
  if (props.content.type === ContentType.NOTE) {
    return <NoteTags id={props.content.data.id} />
  }
  else if (props.content.type === ContentType.NOTE_TEMPLATE) {
    return <TemplateTags id={props.content.data.id} />
  }
  else {
    return <TaskListTags id={props.content.data.id} />
  }
}

export function NoteTags(props: {id: string}) {
  const noteTags = useSelector((state: ApplicationState) => selectNoteTags(state, props.id));
  return (
    <TagsDisplay tags={noteTags} />
  )
}

export function TemplateTags(props: {id: string}) {
  const templateTags = useSelector((state: ApplicationState) => selectNoteTemplateTags(state, props.id));
  return (
    <TagsDisplay tags={templateTags} />
  )
}

export function TaskListTags(props: {id: string}) {
  const taskListTags = useSelector((state: ApplicationState) => selectTaskListTags(state, props.id));
  return (
    <TagsDisplay tags={taskListTags} />
  )
}

export function TagsDisplay(props: {tags: Tag[]}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {props.tags.map(tag =>
        <TagElement
          key={tag.id}
          text={tag.name}
          backgroundColour={tag.backgroundColour}
          textColour={tag.textColour}
        />
      )}
    </div>
  )
}