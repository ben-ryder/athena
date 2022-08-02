import React from 'react';
import {P} from "@ben-ryder/jigsaw";
import {LoadingIcon} from "../element/loading-icon";
import {Page} from "./page";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {AlertOctagon as ErrorIcon} from "lucide-react";
import {Header} from "../regions/header";

export interface LoadingPageProps {
  hideHeader?: boolean,
  status: GeneralQueryStatus,
  loadingMessage: string,
  errorMessage: string,
  emptyMessage: string
}

//todo: make error & empty messages optional

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

  if (props.hideHeader) {
    return (
      <div className="min-h-screen flex flex-col bg-br-atom-700">
        <div className="grow relative flex flex-col">
          <div className="grow flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              {icon}
              <P className="text-br-whiteGrey-200 mt-4">{message}</P>
            </div>
          </div>
        </div>
      </div>
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

