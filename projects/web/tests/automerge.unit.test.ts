/**
 * Testing that Automerge works as expected & required by this application,
 * and that all change function also work as expected.
 */

import { initialDatabase } from "../src/state/schemas/initial-database";
import * as A from "@automerge/automerge"
import { _createTagChange, _updateTagChange } from "../src/state/schemas/tags/tags.changes";
import { Change } from "@automerge/automerge";
import { VaultDatabase } from "../src/state/application-state";
import { _createItemChange } from "../src/state/schemas/items/items.changes";

test("Updating basic text fields on tags", () => {

	let main = A.clone(initialDatabase)

	const {id: tag1Id, change: tag1Change} = _createTagChange({
		name: "test tag 1",
		variant: null,
	})
	main = A.change(main, tag1Change)

	// check that tag exists as expected in main db
	expect(main.tags.ids.includes(tag1Id)).toEqual(true)
	expect(main.tags.entities[tag1Id].name).toEqual("test tag 1")

	const newChanges: Change[] = []
	newChanges.push(...A.getAllChanges(main))

	// One client
	let client1 = A.clone(main)
	client1 = A.change(client1, _updateTagChange(tag1Id, {name: "test tag 1 client 1"}))
	const client1Change = A.getLastLocalChange(client1)
	if (client1Change) {
		newChanges.push(client1Change)
	}

	let client2 = A.clone(main)
	client2 = A.change(client2, _updateTagChange(tag1Id, {name: "client 2 test tag 1", variant: "red"}))
	const client2Change = A.getLastLocalChange(client2)
	if (client2Change) {
		newChanges.push(client2Change)
	}

	const [combinedDoc] = A.applyChanges(A.clone(initialDatabase), newChanges)

	// When assigning the same name, one should be randomly chosen
	expect(["test tag 1 client 1", "client 2 test tag 1"]).toContain(combinedDoc.tags.entities[tag1Id].name)
	// The variant should be set as expected
	expect(combinedDoc.tags.entities[tag1Id].variant).toEqual("red")
})

test("Updating item tags", () => {

	let main = A.clone(initialDatabase)

	// Add 4 tags
	const {id: tag1Id, change: tag1Change} = _createTagChange({
		name: "test tag 1",
		variant: null,
	})
	const {id: tag2Id, change: tag2Change} = _createTagChange({
		name: "test tag 2",
		variant: "green",
	})
	const {id: tag3Id, change: tag3Change} = _createTagChange({
		name: "test tag 3",
		variant: null,
	})
	const {id: tag4Id, change: tag4Change} = _createTagChange({
		name: "test tag 4",
		variant: "blue",
	})

	main = A.change(main, tag1Change)
	main = A.change(main, tag2Change)
	main = A.change(main, tag3Change)
	main = A.change(main, tag4Change)

	// Add an item with tags
	const {id: item1Id, change: item1Change} = _createItemChange({
		name: "Item 1 test",
		body: "This is a test",
		tags: [tag1Id, tag3Id]
	})
	main = A.change(main, item1Change)

	const newChanges: Change[] = []
	newChanges.push(...A.getAllChanges(main))

	// One client - remove both tags, add tag4 then tag1
	let client1 = A.clone(main)
	client1 = A.change(client1, (db: VaultDatabase) => {
		db.items.entities[item1Id].tags = [tag4Id, tag2Id]
	})

	const client1Change = A.getLastLocalChange(client1)
	if (client1Change) {
		newChanges.push(client1Change)
	}

	// Two client - add tag 2
	let client2 = A.clone(main)
	client2 = A.change(client2, (db: VaultDatabase) => {
		db.items.entities[item1Id].tags = [tag3Id]
		db.items.entities[item1Id].name = "Item test 1 edit"
	})

	const client2Change = A.getLastLocalChange(client2)
	if (client2Change) {
		newChanges.push(client2Change)
	}

	const [combinedDoc] = A.applyChanges(A.clone(initialDatabase), newChanges)

	// One of the tag updates should have been chosen.
	expect([[tag3Id], [tag4Id, tag2Id]]).toContainEqual(combinedDoc.items.entities[item1Id].tags)
})

export {}
