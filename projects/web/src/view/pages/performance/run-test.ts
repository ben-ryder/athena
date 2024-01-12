import {CryptographyHelper} from "../../../localful/encryption/cryptography-helper";
import {VaultDatabase} from "../../../state/storage/database";
import {ActionStatus} from "../../../state/actions";
import {ReportFunction} from "./performance";

const SHORT_STRING = "Chapter - Firstname lastname"
const MEDIUM_STRING = "Magna pars studiorum, prodita quaerimus. Magna pars studiorum, prodita quaerimus. Cras mattis iudicium purus sit amet fermentum. Quo usque tandem abutere, Catilina, patientia nostra?"
const LONG_STRING = "Cras mattis iudicium purus sit amet fermentum. Paullum deliquit, ponderibus modulisque suis ratio utitur. Quisque ut dolor gravida, placerat libero vel, euismod. A communi observantia non est recedendum. Gallia est omnis divisa in partes tres, quarum. Nec dubitamus multa iter quae et nos invenerat. Phasellus laoreet lorem vel dolor tempus vehicula. Quo usque tandem abutere, Catilina, patientia nostra? Curabitur blandit tempus ardua ridiculus sed magna. A communi observantia non est recedendum. Quisque ut dolor gravida, placerat libero vel, euismod. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Quo usque tandem abutere, Catilina, patientia nostra? A communi observantia non est recedendum. Curabitur blandit tempus ardua ridiculus sed magna. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Phasellus laoreet lorem vel dolor tempus vehicula. A communi observantia non est recedendum. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Gallia est omnis divisa in partes tres, quarum. Curabitur blandit tempus ardua ridiculus sed magna. Cras mattis iudicium purus sit amet fermentum. Curabitur blandit tempus ardua ridiculus sed magna. Quisque ut dolor gravida, placerat libero vel, euismod. Magna pars studiorum, prodita quaerimus. Gallia est omnis divisa in partes tres, quarum. Gallia est omnis divisa in partes tres, quarum. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. A communi observantia non est recedendum. Cras mattis iudicium purus sit amet fermentum. Curabitur blandit tempus ardua ridiculus sed magna. Unam incolunt Belgae, aliam Aquitani, tertiam. A communi observantia non est recedendum. Quisque ut dolor gravida, placerat libero vel, euismod. Curabitur est gravida et libero vitae dictum. Unam incolunt Belgae, aliam Aquitani, tertiam. Unam incolunt Belgae, aliam Aquitani, tertiam. Pellentesque habitant morbi tristique senectus et netus. Paullum deliquit, ponderibus modulisque suis ratio utitur. Curabitur est gravida et libero vitae dictum. Pellentesque habitant morbi tristique senectus et netus. Curabitur est gravida et libero vitae dictum. Unam incolunt Belgae, aliam Aquitani, tertiam. Pellentesque habitant morbi tristique senectus et netus. Inmensae subtilitatis, obscuris et malesuada fames. Gallia est omnis divisa in partes tres, quarum. Curabitur blandit tempus ardua ridiculus sed magna. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. A communi observantia non est recedendum. Phasellus laoreet lorem vel dolor tempus vehicula. A communi observantia non est recedendum. Nec dubitamus multa iter quae et nos invenerat. Nec dubitamus multa iter quae et nos invenerat. Unam incolunt Belgae, aliam Aquitani, tertiam. Paullum deliquit, ponderibus modulisque suis ratio utitur. Curabitur est gravida et libero vitae dictum. A communi observantia non est recedendum. Quisque ut dolor gravida, placerat libero vel, euismod. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Curabitur est gravida et libero vitae dictum. A communi observantia non est recedendum. Magna pars studiorum, prodita quaerimus. Curabitur est gravida et libero vitae dictum. A communi observantia non est recedendum. Quo usque tandem abutere, Catilina, patientia nostra? Phasellus laoreet lorem vel dolor tempus vehicula. Unam incolunt Belgae, aliam Aquitani, tertiam. Magna pars studiorum, prodita quaerimus. Quo usque tandem abutere, Catilina, patientia nostra? Paullum deliquit, ponderibus modulisque suis ratio utitur. A communi observantia non est recedendum. Curabitur est gravida et libero vitae dictum. Quisque ut dolor gravida, placerat libero vel, euismod. Curabitur est gravida et libero vitae dictum. Pellentesque habitant morbi tristique senectus et netus. Curabitur est gravida et libero vitae dictum."

const TAG_NUMBER = 50
const TAG_VERSIONS_NUMBER = 10

const CONTENT_TYPE_NUMBER = 10
const CONTENT_TYPE_VERSIONS_NUMBER = 20

const CONTENT_TYPE_FIELD_NUMBER = 10
const CONTENT_TYPE_FIELD_VERSIONS_NUMBER = 20

const CONTENT_NUMBER = 500
const CONTENT_FIELDS_VERSIONS_NUMBER = 50

export async function runTest(report: ReportFunction) {
	report({level: "section", text: "Setup"})
	const vaultId = await CryptographyHelper.generateUUID()
	const vaultName = `perf_${vaultId}`
	const perfDb = new VaultDatabase(vaultName)
	report({level: "message", text: `Created test vault ${vaultName}`})

	await createTestData(perfDb, report)
	await queryTestData(perfDb, report)

	report({level: "section", text: "Teardown"})
	await perfDb.delete()
	report({level: "message", text: "deleted test vault"})
}

export async function createTestData(perfDb: VaultDatabase, report: ReportFunction) {
	report({level: "section", text: "Tags"})
	report({level: "task", text: "Creating Tags"})
	const tagCreationStart = performance.now()
	for (let i = 1; i <= TAG_NUMBER; i++) {
		const tagId = await perfDb.tagsHelper.createTag({name: SHORT_STRING, variant: "purple"})
		if (!tagId.success) throw tagId

		for (let j = 1; j <= TAG_VERSIONS_NUMBER; j++) {
			await perfDb.tagsHelper.updateTag(tagId.data, {name: SHORT_STRING, variant: "purple"})
		}
	}
	const tagCreationEnd = performance.now()
	report({level: "message", text: `created ${TAG_NUMBER} tags, with ${TAG_VERSIONS_NUMBER} versions each in ${tagCreationEnd - tagCreationStart}ms`})
}

export async function queryTestData(perfDb: VaultDatabase, report: ReportFunction) {
	report({level: "task", text: "Fetching Tags"})
	const getTagsStart = performance.now()
	const tags = await perfDb.tagsHelper.getTags()
	if (tags.status !== ActionStatus.SUCCESS) throw tags
	const getTagsEnd = performance.now()
	report({level: "message", text: `fetched all tag in ${getTagsEnd - getTagsStart}ms`})

	report({level: "task", text: "Fetching Single Tag"})
	const tagId = tags.data[10].id
	const getTagStart = performance.now()
	await perfDb.tagsHelper.getTag(tagId)
	const getTagEnd = performance.now()
	report({level: "message", text: `fetched single tag in ${getTagEnd - getTagStart}ms`})

	report({level: "task", text: "Updating Tag"})
	const updateTagId = tags.data[20].id
	const updateTagStart = performance.now()
	await perfDb.tagsHelper.updateTag(updateTagId, {name: SHORT_STRING})
	const updateTagEnd = performance.now()
	report({level: "message", text: `updated tag in ${updateTagEnd - updateTagStart}ms`})

	report({level: "task", text: "Deleting Tag"})
	const deleteTagId = tags.data[15].id
	const deleteTagStart = performance.now()
	await perfDb.tagsHelper.deleteTag(deleteTagId)
	const deleteTagEnd = performance.now()
	report({level: "message", text: `deleted tag in ${deleteTagEnd - deleteTagStart}ms`})
}

