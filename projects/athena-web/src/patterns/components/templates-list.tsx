import React from "react";
import {selectActiveContent} from "../../main/state/features/ui/ui-selctors";
import {useSelector} from "react-redux";
import {Button} from "@ben-ryder/jigsaw";
import {v4 as createUUID} from "uuid";
import {useAppDispatch} from "../../main/state/store";
import {selectTemplates} from "../../main/state/features/open-vault/templates/templates-selectors";
import {createTemplate} from "../../main/state/features/open-vault/templates/templates-actions";
import {TemplateCard} from "./content-card/content-card";


export function TemplatesList() {
  const dispatch = useAppDispatch();
  const activeContent = useSelector(selectActiveContent);
  const templates = useSelector(selectTemplates);

  return (
    <>
      <div className="p-4 flex justify-end">
        <Button onClick={() => {
          dispatch(createTemplate({
            id: createUUID(),
            name: "untitled",
            body: "",
            folderId: null,
            targetFolderId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
        }}>New Template</Button>
      </div>
      <div className="mx-4">
        {templates.map(template =>
          <TemplateCard
            key={template.id}
            template={template}
            active={activeContent !== null && activeContent.data.id === template.id}
          />
        )}
        {templates.length === 0 &&
            <div className="mx-4">
                <p className="text-center text-br-whiteGrey-100">0 Templates Found</p>
            </div>
        }
      </div>
    </>
  )
}
