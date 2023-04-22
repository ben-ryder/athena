import {ReactNode} from "react";

export interface J2ButtonGroupProps {
	children: ReactNode
}

export function J2ButtonGroup(props: J2ButtonGroupProps) {
	return (
		<div className="j-button-group">
			{props.children}
		</div>
	)
}