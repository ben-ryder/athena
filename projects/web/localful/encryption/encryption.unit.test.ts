import {LocalfulEncryption} from "./encryption";
import {z} from "zod";

test('encrypt and decrypt a string', async () => {
	const key = await LocalfulEncryption._createEncryptionKey()
	const inputText = "this is some test data";

	const encrypted = await LocalfulEncryption.encrypt(key, inputText);
	const decryptedText = await LocalfulEncryption.decrypt(key, encrypted);

	expect(decryptedText).toBe(inputText);
})

test('encrypt and decrypt an object', async () => {
	const key = await LocalfulEncryption._createEncryptionKey()
	const inputData = { text: "this is some test data", number: 1, nested: { boolean: true } } as const

	const encrypted = await LocalfulEncryption.encrypt(key, inputData);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- real usages should validate data and infer types, but we don't care about types for this text.
	const decryptedData = await LocalfulEncryption.decrypt(key, encrypted) as any;

	expect(decryptedData.text).toBe(inputData.text);
	expect(decryptedData.number).toBe(inputData.number);
	expect(decryptedData.nested.boolean).toBe(inputData.nested.boolean);
})

test('encrypt and decrypt an object with schema validation', async () => {
	const key = await LocalfulEncryption._createEncryptionKey()
    
	const Schema = z.object({
		id: z.string().uuid(),
		name: z.string(),
		isDeleted: z.union([z.literal(0), z.literal(1)]),
	})
    type Schema = z.infer<typeof Schema>
    
    const inputData: Schema = {
    	id: '73193bf6-b592-4b1b-9256-001484723e15',
    	name: 'example',
    	isDeleted: 0
    }

    const encrypted = await LocalfulEncryption.encrypt(key, inputData);

    await expect(LocalfulEncryption.decrypt<Schema>(key, encrypted, Schema)).resolves.not.toThrow()
})

test('encrypt and decrypt an object with schema validation that should fail', async () => {
	const key = await LocalfulEncryption._createEncryptionKey()

	const Schema = z.object({
		id: z.string().uuid(),
		name: z.string(),
		isDeleted: z.union([z.literal(0), z.literal(1)]),
	}).strict()
    type Schema = z.infer<typeof Schema>

    const inputData = {
    	name: 'master',
    	isDeleted: true
    }

    const encrypted = await LocalfulEncryption.encrypt(key, inputData);

    await expect(LocalfulEncryption.decrypt<Schema>(key, encrypted, Schema)).rejects.toThrow()
})

test('create and then decrypted a protected encryption key', async () => {
	const password = "password1234"
	const createdEncryptionKey = await LocalfulEncryption.createProtectedEncryptionKey(password)

	const decryptedKey = await LocalfulEncryption.decryptProtectedEncryptionKey(createdEncryptionKey.protectedEncryptionKey, password);

	expect(decryptedKey).toBe(createdEncryptionKey.encryptionKey);
})

test('create and then decrypted a protected encryption key with incorrect password', async () => {
	const password = "password1234"
	const createdEncryptionKey = await LocalfulEncryption.createProtectedEncryptionKey(password)

	await expect(LocalfulEncryption.decryptProtectedEncryptionKey(createdEncryptionKey.protectedEncryptionKey, "password123")).rejects.toThrow()
})

test('create a protected encryption key to encrypt data, then decrypt key and decrypt data', async () => {
	const password = "password1234"
	const createdEncryptionKey = await LocalfulEncryption.createProtectedEncryptionKey(password)

	const inputText = "this is some test data";
	const encryptedText = await LocalfulEncryption.encrypt(createdEncryptionKey.encryptionKey, inputText);

	const decryptedKey = await LocalfulEncryption.decryptProtectedEncryptionKey(createdEncryptionKey.protectedEncryptionKey, password);
	const decryptedText = await LocalfulEncryption.decrypt<string>(decryptedKey, encryptedText)

	expect(decryptedText).toBe(inputText);
})

test('update protected encryption key password', async () => {
	// Create a protected encryption key and encrypt some data
	const password = "password1234"
	const { encryptionKey, protectedEncryptionKey } = await LocalfulEncryption.createProtectedEncryptionKey(password)
	const inputText = "this is some test data";
	const encryptedText = await LocalfulEncryption.encrypt(encryptionKey, inputText);

	// Update the protected encryption key with a new password
	const newPassword = "password42"
	const {
		encryptionKey: newEncryptionKey,
		protectedEncryptionKey: newProtectedEncryptionKey
	} = await LocalfulEncryption.updateProtectedEncryptionKey(protectedEncryptionKey, password, newPassword)

	// Stored encryption key should still be the same
	expect(newEncryptionKey).toBe(encryptionKey)

	// Should still be able to decrypt data encrypted before protected key was updated.
	const decryptedText = await LocalfulEncryption.decrypt(newEncryptionKey, encryptedText)
	expect(decryptedText).toBe(inputText);

	// Updated protected key should now use new password
	await expect(LocalfulEncryption.decryptProtectedEncryptionKey(newProtectedEncryptionKey, password)).rejects.toThrow()
	await expect(LocalfulEncryption.decryptProtectedEncryptionKey(newProtectedEncryptionKey, newPassword)).resolves.not.toThrow()
})
