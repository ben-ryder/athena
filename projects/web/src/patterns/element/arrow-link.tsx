import {ArrowLeft, ArrowRight} from "lucide-react";
import classNames from "classnames";
import {StrictReactNode} from "@ben-ryder/jigsaw";
import {Link} from "react-router-dom";

export const linkStyles = {
  regular: "font-bold underline-offset-2 text-br-whiteGrey-200 hover:underline hover:text-br-teal-600 focus:underline focus:text-br-teal-600"
}

export interface ArrowLinkProps {
  direction: "left" | "right",
  link: string,
  className?: string,
  children: StrictReactNode
}

export function ArrowLink(props: ArrowLinkProps) {
  const className = classNames(
    linkStyles.regular,
    props.className,
    "flex"
  )

  if (props.link.startsWith("http")) {
    return (
      <a className={className} href={props.link}>
        {props.direction === "left" && <ArrowLeft className="mr-0.5" />}
        <span>{props.children}</span>
        {props.direction === "right" && <ArrowRight className="ml-0.5" />}
      </a>
    )
  }

  return (
    <Link className={className} to={props.link}>
      {props.direction === "left" && <ArrowLeft className="mr-0.5" />}
      <span>{props.children}</span>
      {props.direction === "right" && <ArrowRight className="ml-0.5" />}
    </Link>
  )
}
