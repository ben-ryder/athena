import {useSelector} from "react-redux";
import {selectCurrentListViewSection} from "../../main/state/features/ui/view/view-selectors";
import {ListViewSection} from "../../main/state/features/ui/view/view-interface";
import {ContentList} from "./content-list";
import {useAppDispatch} from "../../main/state/store";
import {switchCurrentListViewSection} from "../../main/state/features/ui/view/view-actions";
import classNames from "classnames";
import {Button} from "@ben-ryder/jigsaw";
import {createNote} from "../../main/state/features/open-vault/notes/notes-actions";
import {v4 as createUUID} from "uuid";
import React from "react";

export interface ListViewSectionProps {
  text: string,
  active: boolean,
  action: () => void
}

export function ListViewSelector(props: ListViewSectionProps) {
  return (
    <button
      className={classNames(
        "text-br-whiteGrey-50 border-b-4 py-1 w-[100px]",
        {
          "border-br-teal-600": props.active,
          "border-br-blueGrey-600": !props.active
        }
      )}
      onClick={props.action}
    >{props.text}</button>
  )
}


export function ListView() {
  const dispatch = useAppDispatch();
  const currentListViewSection = useSelector(selectCurrentListViewSection);

  let content;
  if (currentListViewSection === ListViewSection.LIST) {
    content = <ContentList />
  }
  else {
    content = <p>Queries</p>
  }

  return (
    <div>
      <div className="flex justify-center items-center p-2">
        <ListViewSelector
          text="Queries"
          action={() => {dispatch(switchCurrentListViewSection(ListViewSection.QUERIES))}}
          active={currentListViewSection === ListViewSection.QUERIES}
        />
        <ListViewSelector
          text="All Content"
          action={() => {dispatch(switchCurrentListViewSection(ListViewSection.LIST))}}
          active={currentListViewSection === ListViewSection.LIST}
        />
      </div>
      {content}
    </div>
  )
}