import {ComponentProps} from "react";

export const linkStyles = {
  regular: "underline underline-offset-2 text-br-whiteGrey-200 hover:text-br-teal-600"
}

export interface LinkProps extends ComponentProps<'a'> {}

export function Link(props: LinkProps) {
  const {children, className, ...passThroughProps} = props;

  const processedClassName = props.className || linkStyles.regular;

  return (
    <a className={processedClassName} {...passThroughProps}>{children}</a>
  )
}