import {LocalfulEncryption} from "@localful-athena/encryption/localful-encryption";
import {ReportFunction} from "./performance-manager";
import {LocalfulWeb} from "@localful-athena/localful-web";
import { DATA_SCHEMA, localful } from "../../../../state/athena-localful";

const SHORT_STRING = "Chapter - Firstname lastname"
const TAG_NUMBER = 50
const TAG_VERSIONS_NUMBER = 20

export async function runTest(report: ReportFunction) {
	const benchmarkStartTime = performance.now()

	report({level: "section", text: "Setup"})
	const id = await LocalfulEncryption.generateUUID()
	const databaseId = `perf_${id}`
	localful.db.setCurrentDatabase(databaseId)

	report({level: "message", text: `Created test database ${databaseId}`})

	await createTestData(localful, report)
	await queryTestData(localful, report)

	report({level: "section", text: "Teardown"})
	await localful.db.deleteDatabase(databaseId)
	report({level: "message", text: "deleted database vault"})

	const benchmarkEndTime = performance.now()
	report({level: "section", text: "Final Report"})
	report({level: "message", text: `Full benchmark ran in ${benchmarkEndTime - benchmarkStartTime}ms`})
}

export async function createTestData(localful: LocalfulWeb<typeof DATA_SCHEMA>, report: ReportFunction) {
	report({level: "section", text: "Tags"})
	report({level: "task", text: "Creating Tags"})
	const tagCreationStart = performance.now()
	for (let i = 1; i <= TAG_NUMBER; i++) {
		const tagId = await localful.db.create('tags', {name: SHORT_STRING, colourVariant: "purple"})
		if (!tagId.success) throw tagId

		for (let j = 1; j <= TAG_VERSIONS_NUMBER; j++) {
			await localful.db.update('tags', tagId.data, {name: SHORT_STRING, colourVariant: "purple"})
		}
	}
	const tagCreationEnd = performance.now()
	report({level: "message", text: `created ${TAG_NUMBER} tags, with ${TAG_VERSIONS_NUMBER} versions each in ${tagCreationEnd - tagCreationStart}ms`})
}

export async function queryTestData(localful: LocalfulWeb<typeof DATA_SCHEMA>, report: ReportFunction) {
	report({level: "task", text: "Fetching Tags"})
	const getTagsStart = performance.now()
	const tags = await localful.db.query('tags')
	if (!tags.success) throw tags
	const getTagsEnd = performance.now()
	report({level: "message", text: `fetched all tags in ${getTagsEnd - getTagsStart}ms`})

	// report({level: "task", text: "Fetching Tags Again (from memory cache)"})
	// const getTagsRetryStart = performance.now()
	// await perfDb.tagQueries.getAll()
	// if (!tags.success) throw tags
	// const getTagsRetryEnd = performance.now()
	// report({level: "message", text: `fetched all tag in ${getTagsRetryEnd - getTagsRetryStart}ms`})

	report({level: "task", text: "Fetching Single Tag"})
	const tagId = tags.data[10].id
	const getTagStart = performance.now()
	await localful.db.get('tags', tagId)
	const getTagEnd = performance.now()
	report({level: "message", text: `fetched single tag in ${getTagEnd - getTagStart}ms`})

	// report({level: "task", text: "Fetching Single Tag Again (from memory cache)"})
	// const getTagRetryStart = performance.now()
	// await perfDb.tagQueries.get(tagId)
	// const getTagRetryEnd = performance.now()
	// report({level: "message", text: `fetched single tag in ${getTagRetryEnd - getTagRetryStart}ms`})

	report({level: "task", text: "Updating Tag"})
	const updateTagId = tags.data[20].id
	const updateTagStart = performance.now()
	await localful.db.update('tags', updateTagId, {name: SHORT_STRING})
	const updateTagEnd = performance.now()
	report({level: "message", text: `updated tag in ${updateTagEnd - updateTagStart}ms`})

	report({level: "task", text: "Deleting Tag"})
	const deleteTagId = tags.data[15].id
	const deleteTagStart = performance.now()
	await localful.db.delete('tags', deleteTagId)
	const deleteTagEnd = performance.now()
	report({level: "message", text: `deleted tag in ${deleteTagEnd - deleteTagStart}ms`})
}

