import { JPillButton } from "@ben-ryder/jigsaw-react";
import "./list-tags-screen.scss";
import { QueryStatus } from "@localful-athena/control-flow";
import { ErrorCallout } from "../../../../../patterns/components/error-callout/error-callout";
import {
  GenericManagerScreenProps
} from "../../../../../common/generic-manager/generic-manager";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {localful} from "../../../../../../state/athena-localful";

export function ListTagsScreen(props: GenericManagerScreenProps) {
  const tags = useObservableQuery(localful.db.observableQuery('tags'))

  return (
    <>
      <div className="tags-list">
        {tags.status === QueryStatus.ERROR && <ErrorCallout errors={tags.errors} />}
        <div className="tags-list__list">
          <JPillButton
            onClick={() => {
              props.navigate({screen: "new"})
            }}
            style={{fontWeight: "bold"}}
          >
            Create New Tag
          </JPillButton>
          {tags.status === QueryStatus.SUCCESS && tags.data.map((tag) => (
            <JPillButton
              onClick={() => {
                props.navigate({screen: "edit", id: tag.id})
              }}
              key={tag.id}
              variant={tag.data.colourVariant || undefined}
            >{tag.data.name}</JPillButton>
          ))}
        </div>
      </div>
    </>
  );
}
