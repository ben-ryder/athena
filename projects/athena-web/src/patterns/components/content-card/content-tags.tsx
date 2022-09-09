import {Content, ContentType} from "../../../main/state/features/ui/content/content-interface";
import {useSelector} from "react-redux";
import {selectNoteTags} from "../../../main/state/features/open-vault/notes-tags/notes-tags-selectors";
import {ApplicationState} from "../../../main/state/state-interface";
import {selectTemplateTags} from "../../../main/state/features/open-vault/templates-tags/templates-tags-selectors";
import {selectTaskListTags} from "../../../main/state/features/open-vault/task-lists-tags/task-lists-tags-selectors";
import {Tag} from "../../../main/state/features/open-vault/open-vault-interfaces";
import {Tag as TagElement} from "@ben-ryder/jigsaw";
import {ContentData} from "../../../main/state/features/ui/content/content-selctors";

export interface ContentTagsProps {
  content: ContentData
}

export function ContentTags(props: ContentTagsProps) {
  if (props.content.type === ContentType.NOTE) {
    return <NoteTags id={props.content.data.id} />
  }
  else if (props.content.type === ContentType.TEMPLATE) {
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
  const templateTags = useSelector((state: ApplicationState) => selectTemplateTags(state, props.id));
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
          text={tag.name}
          backgroundColour={tag.backgroundColour}
          textColour={tag.textColour}
        />
      )}
    </div>
  )
}