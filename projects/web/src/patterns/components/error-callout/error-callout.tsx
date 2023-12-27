import { JAccordion, JAccordionItem, JCallout, JProse } from "@ben-ryder/jigsaw-react";
import React from "react";
import { ApplicationError } from "../../../state/status/errors";

export interface ErrorCalloutProps {
  error: ApplicationError
}

export function ErrorCallout(props: ErrorCalloutProps) {
  console.log(props.error.context)

  return (
    <JCallout variant="critical">
      <p>{props.error.userMessage}</p>
      {(props.error.description || props.error.context) && (
        <JAccordion>
          <JAccordionItem title="Error Details">
            <JProse>
              {props.error.description && (
                <p>{props.error.description}</p>
              )}
              {props.error.context && (
                <>
                  <pre>
                    <code>
                      {props.error.context.message}
                    </code>
                    {/* todo: including stack causing overflow issues? */}
                    {/*<code>*/}
                    {/*  {props.error.context.stack}*/}
                    {/*</code>*/}
                  </pre>
                  <p />
                </>
              )}
            </JProse>
          </JAccordionItem>
        </JAccordion>
      )}
    </JCallout>
  )
}
