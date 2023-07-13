import { NoteForm } from "./note-form";
import { AthenaDatabase } from "../../state/features/database/athena-database";
import { v4 as createUUID } from "uuid";
import { useLFBApplication } from "../../utils/lfb-context";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { Helmet } from "react-helmet-async";
import React from "react";
import { NoteContent } from "../../state/features/database/notes";

export function CreateNotePage() {
	const navigate = useNavigate();
	const { makeChange } = useLFBApplication();

	async function onSave(newNote: NoteContent) {
		const id = createUUID();
		const timestamp = new Date().toISOString();

		await makeChange((doc: AthenaDatabase) => {
			doc.notes.content.ids.push(id);
			doc.notes.content.entities[id] = {
				id: id,
				name: newNote.name,
				body: newNote.body,
				tags: newNote.tags,
				createdAt: timestamp,
				updatedAt: timestamp,
				customFields: [],
			};
		});

		navigate(routes.content.notes.list);
	}

	return (
		<>
			<Helmet>
				<title>Create Note | Athena</title>
			</Helmet>
			<NoteForm
				noteContent={{ name: "", body: "", tags: [], customFields: [] }}
				onSave={onSave}
			/>
		</>
	);
}
