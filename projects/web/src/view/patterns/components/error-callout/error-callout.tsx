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
          <>
              <p>{`${error.type}: ${error.description}`}</p>
          </>
        ))}
    </JCallout>
  )
}
