import React, {useEffect, useState} from 'react';
import {RegisterEnabledPage} from "./register-enabled";
import {RegisterDisabledPage} from "./register-disabled";
import {LoadingPage} from "../../../patterns/pages/loading-page";


export enum RegistrationStatus {
  CHECK_IN_PROGRESS = "CHECK_IN_PROGRESS",
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export function RegisterPage() {
  const [status, setStatus] = useState<RegistrationStatus>(RegistrationStatus.CHECK_IN_PROGRESS);

  useEffect(() => {
    //todo: replace with real check
    async function checkEnabled() {
      setTimeout(() => {
        setStatus(RegistrationStatus.ENABLED);
      }, 1000)
    }
    checkEnabled();
  }, [])

  if (status === RegistrationStatus.ENABLED) {
    return (
      <RegisterEnabledPage />
    )
  }
  else if (status === RegistrationStatus.DISABLED) {
    return (
      <RegisterDisabledPage />
    )
  }
  else {
    return (
      <LoadingPage text="Checking if account registration is currently enabled..." />
    )
  }
}

