import React, {useEffect, useState} from 'react';
import {RegisterEnabledPage} from "./register-enabled";
import {RegisterDisabledPage} from "./register-disabled";
import {LoadingPage} from "../../../patterns/pages/loading-page";
import {useAthena} from "../../../helpers/use-athena";
import {Helmet} from "react-helmet-async";
import {GeneralQueryStatus} from "../../../types/general-query-status";


export enum RegistrationStatus {
  CHECK_IN_PROGRESS = "CHECK_IN_PROGRESS",
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export function RegisterPage() {
  const {apiClient} = useAthena();
  const [status, setStatus] = useState<RegistrationStatus>(RegistrationStatus.CHECK_IN_PROGRESS);

  useEffect(() => {
    async function checkEnabled() {
      try {
        const info = await apiClient.getInfo();

        if (info.registrationEnabled) {
          setStatus(RegistrationStatus.ENABLED);
        }
        else {
          setStatus(RegistrationStatus.DISABLED);
        }
      }
      catch (e) {
        console.log(e);
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

