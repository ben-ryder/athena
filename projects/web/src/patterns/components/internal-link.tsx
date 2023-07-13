import {JTextLinkProps, JArrowLinkProps, JButtonLinkProps, JBadgeProps} from "@ben-ryder/jigsaw-react";
import {Link} from "react-router-dom";


export function InternalLink(props: JTextLinkProps | JArrowLinkProps | JButtonLinkProps | JBadgeProps) {
	if (props.href?.startsWith("/")) {
		const {href, ...htmlProps} = props;
		return (
			<>
				{/* @ts-ignore */}
				<Link to={href} {...htmlProps} />
			</>
		)
	}

	return (
		<a {...props} />
	)
}