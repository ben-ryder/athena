
import importData from "./import-data.json"
import {LocalfulWeb} from "../../../localful-web";
import {DATA_SCHEMA} from "../../../../src/state/athena-localful";
import {ExportData} from "../../types";

test('import data into new database', async () => {
	const localful = new LocalfulWeb<DATA_SCHEMA>({
		dataSchema: DATA_SCHEMA,
	})
	const newDatabaseId = await localful.createDatabase({
		name: "import-test",
		syncEnabled: 0,
	}, 'password1234')
	const db = await localful.openDatabase(newDatabaseId)
	if (!db) {
		return fail('Could not load created database;')
	}

	await db.import(importData as ExportData<DATA_SCHEMA>)

	const content = await db.get('content', 'e9b9bd96-9637-4e95-bb82-d374b32871c3')
    
	expect(content.data.name).toBe('testing');
})