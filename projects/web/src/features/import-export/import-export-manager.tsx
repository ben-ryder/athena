import {JButton, JInput} from "@ben-ryder/jigsaw-react";
import {useRef} from "react";
import {useLocalful} from "@localful-athena/react/use-localful";
import {ExportDatabase} from "./export-database";
import {ImportDatabase} from "./import-database";

export function ImportExportManager() {
	const { currentDatabase } = useLocalful()

	const fileInputRef = useRef<HTMLInputElement>(null)

	async function onImport() {
		if (!currentDatabase) {
			return
		}

		if (fileInputRef.current?.files) {
			const files = fileInputRef.current.files

			if (files.length > 0) {
				const file = files.item(0)

				if (file) {
					const fileContent = await file.arrayBuffer()
					const fileText = new TextDecoder().decode(fileContent)
					console.debug(fileText)
				}
			}
		}
	}

	return (
		<div>
			<ExportDatabase />
			<ImportDatabase />
		</div>
	)
}
