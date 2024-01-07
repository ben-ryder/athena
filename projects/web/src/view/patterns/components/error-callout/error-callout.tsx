import { JCallout } from "@ben-ryder/jigsaw-react";
import React from "react";
import { ApplicationError } from "../../../../state/actions";

export interface ErrorCalloutProps {
  errors: ApplicationError[]
}

export function ErrorCallout(props: ErrorCalloutProps) {
  console.log(props.errors)

  return (
    <JCallout variant="critical">
      {props.errors.map(error => (
        <div key={error.toString()}>
          <strong>{`${error.type}: ${error.userMessage}`}</strong>
          <p>{error.devMessage}</p>
        </div>
      ))}
    </JCallout>
  )
}
