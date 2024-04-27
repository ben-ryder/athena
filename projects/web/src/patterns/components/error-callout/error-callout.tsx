import { JCallout } from "@ben-ryder/jigsaw-react";
import React from "react";
import { ErrorObject } from "@localful-athena/control-flow";

export interface ErrorCalloutProps {
  errors: ErrorObject[]
}

export function ErrorCallout(props: ErrorCalloutProps) {
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
