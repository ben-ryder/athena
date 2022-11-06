import {TagForm} from "./tag-form";
import {Button, IconButton, iconColorClassNames, iconSizes, Tag} from "@ben-ryder/jigsaw";
import React, {useState} from "react";
import {useAppDispatch} from "../../state/store";
import {useSelector} from "react-redux";
import {TagsListFilterIconAndPopup} from "./popup-menus/tags-list-filter-icon-and-popup";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {
  decrementTagsList,
  incrementTagsList
} from "../../state/features/ui/view/view-actions";
import {TagCard} from "./tag-card";
import {selectTagsList} from "../../state/features/database/tags-list-selectors";
import {createTag} from "../../state/features/database/tags/tags-thunks";

export function TagsView() {
  const dispatch = useAppDispatch();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const tagsData = useSelector(selectTagsList);

  const totalPages = Math.max(Math.round(tagsData.meta.total / tagsData.meta.pageSize), 1);
  const totalCurrentCount = tagsData.meta.pageSize * (tagsData.meta.currentPage - 1) + tagsData.list.length;
  const showBackArrow = tagsData.meta.currentPage > 1;
  const showForwardArrow = tagsData.meta.total - totalCurrentCount > 0;

  return (
    <>
      <div className="m-4 flex justify-between items-center">
        <Button onClick={() => {setShowAddForm(true)}}>Add New</Button>
        <TagsListFilterIconAndPopup />
      </div>
      <div className="m-4">
        {showAddForm &&
          <div className="bg-br-atom-700 p-4">
            <TagForm
              onSubmit={(tagFields) => {
                dispatch(createTag({
                  name: tagFields.name,
                  backgroundColour: tagFields.backgroundColour,
                  textColour: tagFields.textColour
                }))

                // As this stops the form rendering which means its state is deleted so there's no need
                // to explicitly clear the form for next time.
                setShowAddForm(false);
              }}
              onCancel={() => {setShowAddForm(false)}}
              submitText="Add New"
            />
          </div>
        }
      </div>
      {tagsData.list.length === 0 && !showAddForm &&
          <div className="mx-4">
              <p className="text-center text-br-whiteGrey-100">No Tags Found</p>
          </div>
      }
      {tagsData.list.map(tag =>
        <TagCard key={tag.id} tag={tag} />
      )}
      <div className="my-6 mx-4 flex justify-between items-center">
        <p className="text-br-whiteGrey-100">page {tagsData.meta.currentPage}/{totalPages} - {totalCurrentCount}/{tagsData.meta.total} items</p>
        <div className="flex items-center">
          {showBackArrow &&
              <IconButton
                  label="Back Page" icon={<ArrowLeft size={iconSizes.medium} className={iconColorClassNames.secondary}/>}
                  onClick={() => {dispatch(decrementTagsList())}}
              />
          }
          {showForwardArrow &&
              <IconButton
                  className="ml-2"
                  label="Forward Page" icon={<ArrowRight size={iconSizes.medium} className={iconColorClassNames.secondary}/>}
                  onClick={() => {dispatch(incrementTagsList())}}
              />
          }
        </div>
      </div>
    </>
  )
}