import React from "react";
import classNames from "classnames";

export enum SavedStatus {
    SAVED = "SAVED",
    UNSAVED = "UNSAVED"
}

export interface SavedStatusIndicatorProps {
  status: SavedStatus
}

export function SavedStatusIndicator(props: SavedStatusIndicatorProps) {
  return (
    <div className="flex items-center">
      <i className= {classNames(
        "h-[10px] w-[10px] rounded-full",
        {
          "bg-br-green-700": props.status === SavedStatus.SAVED,
          "bg-br-red-500": props.status === SavedStatus.UNSAVED
        }
      )}/>
      <p className="ml-2 text-br-whiteGrey-700 italic">
        {props.status === SavedStatus.SAVED
          ? "All changes saved"
          : "Unsaved changes"
        }
      </p>
    </div>
  )
}