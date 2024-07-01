import { z } from "zod";
import { Buffer } from "buffer";

export const UnlockKeyMetadata = z.object({
	algo: z.literal("PBKDF2"),
	salt: z.string(),
	iterations: z.literal(100000),
	hash: z.literal("SHA-256"),
})
export type UnlockKeyMetadata = z.infer<typeof UnlockKeyMetadata>

export interface UnlockKey {
	key: CryptoKey
	metadata: UnlockKeyMetadata
}

export interface CreatedEncryptionKey {
	protectedEncryptionKey: string
	encryptionKey: string
}

export const EncryptionMetadata = z.object({
	algo: z.literal("AES-GCM"),
	iv: z.string(),
})
export type EncryptionMetadata = z.infer<typeof EncryptionMetadata>

export class LocalfulEncryption {

	static generateUUID(): string {
		return self.crypto.randomUUID()
	}

	static async createDatabaseEncryptionKey(password: string): Promise<CreatedEncryptionKey> {
		const encryptionKey = await LocalfulEncryption._createEncryptionKey()
		const unlockKey = await LocalfulEncryption._deriveUnlockKey(password)
		const protectedEncryptionKey = await LocalfulEncryption._wrapEncryptionKey(encryptionKey, unlockKey)

		return {
			encryptionKey,
			protectedEncryptionKey
		}
	}

	static async decryptDatabaseEncryptionKey(protectedEncryptionKey: string, password: string): Promise<string> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- version may be used in future
		const [version, encodedMetadata, encodedEncryptionKey] = protectedEncryptionKey.split(".")

		const decodedMetadata = Buffer.from(encodedMetadata, "base64").toString()
		const unlockKeyMetadata = UnlockKeyMetadata.parse(JSON.parse(decodedMetadata))
		const unlockKey = await LocalfulEncryption._deriveUnlockKey(password, unlockKeyMetadata.salt)

		const decodedEncryptionKey = Buffer.from(encodedEncryptionKey, "base64").toString()

		return await LocalfulEncryption._decryptWithKey(unlockKey.key, decodedEncryptionKey)
	}

	static async encrypt<T>(encryptionKey: string, data: T): Promise<string> {
		const key = await LocalfulEncryption._getEncryptionCryptoKey(encryptionKey)
		return LocalfulEncryption._encryptWithKey(key, data)
	}

	static async decrypt<T>(
		encryptionKey: string,
		ciphertext: string,
		validationSchema?: z.ZodType<T>,
	): Promise<T> {
		const key = await LocalfulEncryption._getEncryptionCryptoKey(encryptionKey)
		const result = await LocalfulEncryption._decryptWithKey(key, ciphertext)

		if (!validationSchema) {
			return result as T
		}
		return validationSchema.parse(result)
	}

	static async _createEncryptionKey(): Promise<string> {
		const rawKey = window.crypto.getRandomValues(new Uint8Array(32));
		const encodedKey = Buffer.from(rawKey).toString("base64");
		return `v1.${encodedKey}`
	}

	private static _getEncryptionCryptoKey(encryptionKeyString: string): Promise<CryptoKey> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- version isn't used, but may be needed in the future.
		const [version, encodedKeyMaterial] = encryptionKeyString.split('.')
		const keyMaterial = Buffer.from(encodedKeyMaterial, 'base64').buffer

		return window.crypto.subtle.importKey(
			"raw",
			keyMaterial,
			{
				name: "AES-GCM",
			},
			false,
			["encrypt", "decrypt"]
		)
	}

	private static async _deriveUnlockKey(password: string, derivationSalt?: string): Promise<UnlockKey> {
		const baseKey = await window.crypto.subtle.importKey(
			"raw",
			Buffer.from(password),
			"PBKDF2",
			false,
			["deriveKey", "deriveBits"]
		)
		const salt = derivationSalt
			? Buffer.from(derivationSalt, 'base64')
			: window.crypto.getRandomValues(new Uint8Array(16));

		const derivedKey = await window.crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: salt,
				iterations: 100000,
				hash: "SHA-256"
			},
			baseKey,
			{ 'name': 'AES-GCM', 'length': 256 },
			true,
			// Although this key used as a KEK, the wrapping is done
			// manually via the _encryptWithKey and _decryptWithKey methods
			// which means this key usage is actually encrypt/decrypt not wrapKey/unwrapKey.
			["encrypt", "decrypt"]
		)

		const encodedSalt = Buffer.from(salt).toString('base64')

		return {
			key: derivedKey,
			metadata: {
				algo: "PBKDF2",
				salt: encodedSalt,
				iterations: 100000,
				hash: "SHA-256"
			}
		}
	}

	private static async _wrapEncryptionKey(encryptionKey: string, unlockKey: UnlockKey): Promise<string> {
		const wrappedKey = await LocalfulEncryption._encryptWithKey(unlockKey.key, encryptionKey)

		const encodedMetadata = Buffer.from(JSON.stringify(unlockKey.metadata)).toString('base64')
		const encodedKey = Buffer.from(wrappedKey).toString('base64')

		return `v1.${encodedMetadata}.${encodedKey}`
	}

	private static async _encryptWithKey<T>(key: CryptoKey, data: T): Promise<string> {
		const iv = window.crypto.getRandomValues(new Uint8Array(12));

		const encryptedData = await window.crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv
			},
			key,
			// todo: improve generic types to narrow allowed data?
			Buffer.from(JSON.stringify(data))
		)
		const encodedData = Buffer.from(encryptedData).toString('base64')

		const metadata: EncryptionMetadata = {
			algo: "AES-GCM",
			iv: Buffer.from(iv).toString('base64'),
		}
		const encodedMetadata = Buffer.from(JSON.stringify(metadata)).toString('base64')

		return `v1.${encodedMetadata}.${encodedData}`
	}

	private static async _decryptWithKey(
		key: CryptoKey,
		ciphertext: string,
	): Promise<string> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- may be used in future
		const [version, encodedMetadata, encodedData] = ciphertext.split(".")

		const decodedMetadata = Buffer.from(encodedMetadata, "base64").toString()
		const metadata = EncryptionMetadata.parse(JSON.parse(decodedMetadata))

		const decodedCiphertext = Buffer.from(encodedData, "base64")

		const decryptedData = await window.crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv: Buffer.from(metadata.iv, "base64"),
			},
			key,
			decodedCiphertext
		)

		return JSON.parse(Buffer.from(decryptedData).toString())
	}
}
