import {ArrowLinkProps, LinkButtonProps, LinkProps} from "@ben-ryder/jigsaw";
import {Link} from "react-router-dom";

export function InternalLink(props: LinkButtonProps|LinkProps|ArrowLinkProps) {
  return (
    <Link to={props.href || ""} className={props.className}>{props.children}</Link>
  )
}