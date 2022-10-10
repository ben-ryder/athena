import React from 'react';
import {AlertOctagon as ErrorIcon, X as EmptyIcon} from "lucide-react";
import {GeneralQueryStatus} from "../../types/general-query-status";

export interface ContentLoadingIndicatorProps {
  status: GeneralQueryStatus,
  loadingMessage: string,
  errorMessage: string,
  emptyMessage: string
}

export function ContentLoadingIndicator(props: ContentLoadingIndicatorProps) {
  if (props.status === GeneralQueryStatus.SUCCESS) {
    return null;
  }

  let message;
  let icon;
  if (props.status === GeneralQueryStatus.FAILED) {
    message = props.errorMessage;
    icon = (
      <ErrorIcon className="text-br-red-500" width={60} height={60} />
    )
  }
  else if (props.status === GeneralQueryStatus.EMPTY) {
    message = props.emptyMessage;
    icon = (
      <EmptyIcon className="text-br-teal-600" width={60} height={60} />
    )
  }
  else {
    message = props.loadingMessage;
    icon = (
      <i className="fill-br-teal-600">
        <svg width="60" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" rx="1" width="10" height="10"><animate id="a" begin="0;k.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="d" begin="b.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/><animate id="g" begin="e.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/><animate id="j" begin="h.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/></rect><rect x="1" y="13" rx="1" width="10" height="10"><animate id="b" begin="a.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/><animate id="e" begin="d.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="h" begin="g.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/><animate id="k" begin="j.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/></rect></svg>
      </i>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {icon}
      <p className="mt-4 text-br-whiteGrey-100">{message}</p>
    </div>
  );
}

