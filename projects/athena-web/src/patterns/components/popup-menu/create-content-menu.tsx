import { Popover } from "@headlessui/react";
import classNames from "classnames";
import {IconButton, iconColorClassNames} from "@ben-ryder/jigsaw";
import {ArrowLeftRight as VaultIcon, Plus as AddContentIcon} from "lucide-react";
import React from "react";
import {createNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {v4 as createUUID} from "uuid";
import {useAppDispatch} from "../../../main/state/store";
import {createTemplate} from "../../../main/state/features/open-vault/templates/templates-actions";

export function CreateContentMenu() {
  const dispatch = useAppDispatch();

  return (
    <Popover className="absolute right-[10px] flex">
      <Popover.Button
       aria-label="Create Content Menu"
       //data-tip="Add Content"
      >
        <AddContentIcon size={20} className={iconColorClassNames.secondary}/>
      </Popover.Button>

      <Popover.Panel className="shadow-md rounded bg-br-atom-600 absolute mt-4 ml-4 border border-br-blueGrey-700">
        {({ close }) => (
          <>
            <button
              onClick={() => {
                dispatch(createNote({
                  id: createUUID(),
                  name: "untitled",
                  body: "",
                  folderId: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }))
                close()
              }}
              className="whitespace-nowrap p-1 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
            >Note</button>
            <button
              className="whitespace-nowrap p-1 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
            >From Template</button>
            <button className="whitespace-nowrap p-1 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
            >Task List</button>
            <button
              className="whitespace-nowrap p-1 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
              onClick={() => {
                dispatch(createTemplate({
                  id: createUUID(),
                  name: "untitled",
                  body: "",
                  folderId: null,
                  targetFolderId: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }))
                close()
              }}
            >Template</button>
        </>
      )}
      </Popover.Panel>
    </Popover>
  )
}