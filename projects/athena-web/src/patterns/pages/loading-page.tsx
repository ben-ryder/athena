import React from 'react';
import {P} from "@ben-ryder/jigsaw";
import {LoadingIcon} from "../element/loading-icon";
import {Page} from "./page";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {AlertOctagon as ErrorIcon} from "lucide-react";

export interface LoadingPageProps {
  status: GeneralQueryStatus,
  loadingMessage: string,
  errorMessage: string,
  emptyMessage: string
}

export function LoadingPage(props: LoadingPageProps) {
  if (props.status === GeneralQueryStatus.SUCCESS || props.status === GeneralQueryStatus.EMPTY) {
    return null;
  }

  let message;
  let icon;
  if (props.status === GeneralQueryStatus.FAILED) {
    message = props.errorMessage;
    icon = (
      <ErrorIcon className="text-br-red-500" width={100} height={100} />
    )
  }
  else {
    message = props.loadingMessage;
    icon = (
      <LoadingIcon />
    )
  }

  return (
    <Page>
        <div className="grow flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            {icon}
            <P className="text-br-whiteGrey-200 mt-4">{message}</P>
          </div>
      </div>
    </Page>
  );
}

