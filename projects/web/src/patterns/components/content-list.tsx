import React from "react";
import {ContentCard} from "./content-card/content-card";
import {useSelector} from "react-redux";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {ArrowLeft, ArrowRight } from "lucide-react";
import {useAppDispatch} from "../../state/store";
import {decrementContentList, incrementContentList} from "../../state/features/ui/view/view-actions";
import {selectContentList} from "../../state/features/document/content-list-selectors";


export function ContentList() {
  const dispatch = useAppDispatch();
  const contentListData = useSelector(selectContentList);

  const totalPages = Math.max(Math.round(contentListData.meta.total / contentListData.meta.pageSize), 1);
  const totalCurrentCount = contentListData.meta.pageSize * (contentListData.meta.currentPage - 1) + contentListData.list.length;

  const showBackArrow = contentListData.meta.currentPage > 1;
  const showForwardArrow = contentListData.meta.total - totalCurrentCount > 0;

  return (
    <>
      <div className="mx-4 mt-4">
        {contentListData.list.map(content =>
          <ContentCard
            key={content.data.id}
            content={content}
          />
        )}
        {contentListData.list.length === 0 &&
            <div className="mx-4">
                <p className="text-center text-br-whiteGrey-100">No Content Found</p>
            </div>
        }
      </div>
      <div className="my-6 mx-4 flex justify-between items-center">
        <p className="text-br-whiteGrey-100">page {contentListData.meta.currentPage}/{totalPages} - {totalCurrentCount}/{contentListData.meta.total} items</p>
        <div className="flex items-center">
          {showBackArrow &&
              <IconButton
                  label="Back Page" icon={<ArrowLeft size={iconSizes.medium} className={iconColorClassNames.secondary}/>}
                  onClick={() => {dispatch(decrementContentList())}}
              />
          }
          {showForwardArrow &&
              <IconButton
                  className="ml-2"
                  label="Forward Page" icon={<ArrowRight size={iconSizes.medium} className={iconColorClassNames.secondary}/>}
                  onClick={() => {dispatch(incrementContentList())}}
              />
          }
        </div>
      </div>
    </>
  )
}
