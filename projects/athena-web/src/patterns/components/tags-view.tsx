import {TagForm} from "./tag-form";
import {Button} from "@ben-ryder/jigsaw";
import {useState} from "react";
import {useAppDispatch} from "../../main/state/store";
import {createTag} from "../../main/state/features/open-vault/tags/tags-actions";
import {v4 as createUUID} from "uuid";

export function TagsView() {
  const dispatch = useAppDispatch();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  return (
    <>
      <div>
        <Button onClick={() => {setShowAddForm(true)}}>Add New</Button>
      </div>
      <div>
        {showAddForm &&
          <TagForm
            onSubmit={(tagFields) => {dispatch(createTag({
              id: createUUID(),
              name: tagFields.name,
              backgroundColour: tagFields.backgroundColour,
              textColour: tagFields.textColour,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }))}}
            onCancel={() => {setShowAddForm(false)}}
            submitText="Add New"
          />
        }

      </div>
    </>
  )
}