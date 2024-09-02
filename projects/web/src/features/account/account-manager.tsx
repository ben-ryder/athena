import { ReactNode } from "react";
import {useLocalful} from "@localful-athena/react/use-localful";

export function AccountManager() {
	const { serverUrl } = useLocalful()

	let content: ReactNode
	if (serverUrl) {
		content = <p>Account setup</p>
	} else {
		content = <p>Server setup</p>
	}

	return (
		<div>
			{content}
		</div>
	)
}
