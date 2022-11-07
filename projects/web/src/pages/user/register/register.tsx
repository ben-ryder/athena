import React, {useEffect, useState} from 'react';
import {RegisterEnabledPage} from "./register-enabled";
import {RegisterDisabledPage} from "./register-disabled";
import {LoadingPage} from "../../../patterns/pages/loading-page";
import {useApplication} from "../../../helpers/application-context";
import {Helmet} from "react-helmet-async";
import {GeneralQueryStatus} from "../../../types/general-query-status";
import {NoServerError} from "@ben-ryder/lfb-toolkit";


export enum RegistrationStatus {
  CHECK_IN_PROGRESS = "CHECK_IN_PROGRESS",
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export function RegisterPage() {
  const {application} = useApplication();
  const [status, setStatus] = useState<RegistrationStatus>(RegistrationStatus.CHECK_IN_PROGRESS);

  useEffect(() => {
    async function checkEnabled() {
      try {
        const info = await application.getInfo();

        if (info.registrationEnabled) {
          setStatus(RegistrationStatus.ENABLED);
        }
        else {
          setStatus(RegistrationStatus.DISABLED);
        }
      }
      catch (e) {
        if (e instanceof NoServerError) {
          setStatus(RegistrationStatus.DISABLED);
        }
        else {
          console.log(e);
        }
      }
    }
    checkEnabled();
  }, [])

  if (status === RegistrationStatus.ENABLED) {
    return (
      <>
        <Helmet>
          <title>Register | Athena</title>
        </Helmet>
        <RegisterEnabledPage />
      </>
    )
  }
  else if (status === RegistrationStatus.DISABLED) {
    return (
      <>
        <Helmet>
          <title>Registration Disabled | Athena</title>
        </Helmet>
        <RegisterDisabledPage />
      </>
    )
  }
  else {
    return (
      <LoadingPage
        status={GeneralQueryStatus.LOADING}
        loadingMessage="Checking if account registration is currently enabled..."
        errorMessage="An error occurred"
        emptyMessage="An error occurred"
      />
    )
  }
}

