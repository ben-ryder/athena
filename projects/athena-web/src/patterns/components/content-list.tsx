import React from "react";
import {ContentCard} from "./content-card/content-card";
import {useSelector} from "react-redux";
import {selectContentList} from "../../main/state/features/open-vault/content-selectors";


export function ContentList() {
  const contentList = useSelector(selectContentList);

  return (
    <div className="mx-4 mt-4">
      {contentList.map(content =>
        <ContentCard
          key={content.data.id}
          content={content}
        />
      )}
      {contentList.length === 0 &&
          <div className="mx-4">
              <p className="text-center text-br-whiteGrey-100">No Content Found</p>
          </div>
      }
    </div>
  )
}
