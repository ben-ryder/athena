import React from "react";
import classNames from "classnames";

export interface ConnectivityIndicatorProps {
  status: "online" | "offline"
}

export function ConnectivityIndicator(props: ConnectivityIndicatorProps) {
  return (
    <div className="flex items-center">
      <i className= {classNames(
        "h-[10px] w-[10px] rounded-full",
        {
          "bg-br-green-700": props.status === "online",
          "bg-br-red-500": props.status === "offline"
        }
      )}></i>
      <p className="ml-2 text-br-whiteGrey-700 italic">
        {props.status === "online"
          ? "All changes saved"
          : "Unsaved changes"
        }
      </p>
    </div>
  )
}