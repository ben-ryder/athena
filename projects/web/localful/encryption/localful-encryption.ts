import { ActionResult, ErrorTypes } from "../control-flow";
import { z } from "zod";
import * as WebCrypto from "easy-web-crypto"
import {Buffer} from 'buffer'

export interface CreatedEncryptionKey {
	protectedEncryptionKey: string
	encryptionKey: CryptoKey
}


const INITIALIZATION_VECTOR_LENGTH = 12;
const SALT_LENGTH = 16;

/**
 * A helper class which contains the cryptographic functions used
 * to encrypt and decrypt data.
 */
export class LocalfulEncryption {

	static async createDatabaseEncryptionKey(password: string): Promise<CreatedEncryptionKey> {
		const encryptionKey = await window.crypto.subtle.generateKey(
			{
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"],
		);

		const {key: unlockKey, salt: unlockKeySalt } = await LocalfulEncryption.deriveUnlockKey(password)
		const protectedEncryptionKey = await LocalfulEncryption.wrapEncryptionKey(encryptionKey, unlockKey, unlockKeySalt)

		return {
			encryptionKey,
			protectedEncryptionKey
		}
	}

	static async decryptDatabaseEncryptionKey(protectedEncryptionKey: string, password: string): Promise<CryptoKey> {
		const [version, metadata, wrappedKey] = protectedEncryptionKey.split(':')
		if (version !== 'v1' || !metadata || !wrappedKey) {
			throw new Error('protectedEncryptionKey is not in correct format')
		}

		const decodedMetadata = JSON.parse(Buffer.from(metadata, 'base64').toString())
		const {key: unlockKey} = await LocalfulEncryption.deriveUnlockKey(password, decodedMetadata.salt)

		const wrappedEncruptionKey = Buffer.from(wrappedKey, 'base64').buffer
		const iv = Buffer.from(decodedMetadata.iv, 'base64').buffer

		const unWrappedKey = await window.crypto.subtle.unwrapKey(
			"raw",
			wrappedEncruptionKey,
			unlockKey,
			{
				name: "AES-GCM",
				iv
			},
			{
				name: "AES-GCM"
			},
			false,
			["encrypt", "decrypt"]
		)

		return unWrappedKey
	}

	static async deriveUnlockKey(password: string, derivationSalt?: string): Promise<{ key: CryptoKey, salt: string }> {
		const encoder = new TextEncoder();

		const baseKey = await window.crypto.subtle.importKey(
			"raw",
			encoder.encode(password),
			"PBKDF2",
			false,
			["deriveKey", "deriveBits"]
		)
		const salt = derivationSalt
			? Buffer.from(derivationSalt, 'base64').buffer
			: window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

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
			["wrapKey", "unwrapKey"]
		)

		const encodedSalt = Buffer.from(salt).toString('base64')
		return {
			key: derivedKey,
			salt: encodedSalt
		}
	}

	static async wrapEncryptionKey(encryptionKey: CryptoKey, unlockKey: CryptoKey, unlockKeySalt: string): Promise<string> {
		const iv = window.crypto.getRandomValues(new Uint8Array(INITIALIZATION_VECTOR_LENGTH));

		const wrappedKey = await window.crypto.subtle.wrapKey(
			"raw",
			encryptionKey,
			unlockKey,
			{
				name: "AES-GCM",
				iv
			}
		)

		const metadata = {
			iv: Buffer.from(iv).toString('base64'),
			salt: unlockKeySalt
		}
		const encodedMetadata = Buffer.from(JSON.stringify(metadata)).toString('base64')
		const encodedKey = Buffer.from(wrappedKey).toString('base64')

		// Export the key (and iv value used for encryption) in a raw base64 encoded string suitable for saving anywhere.
		// The version is stored in order to handle future data migrations should the method of encryption change.
		return `v1:${encodedMetadata}:${encodedKey}`
	}

	/**
   * Encrypt the given text.
   * The returned string will include the encrypted text and initialization vector combined.
   *
   * @param key
   * @param text
   * @throws EncryptError
   */
	static async encryptText(key: CryptoKey, text: string): Promise<ActionResult<string>> {
		const cipherData = await WebCrypto.encrypt(key, text)
		const ciphertext = JSON.stringify(cipherData)

		return {
			success: true,
			data: ciphertext
		}
	}

	/**
   * Decrypt the given text.
   * The passed string should include the encrypted text, salt and initialization vector.
   *
   * @param key
   * @param text
   * @throws DecryptError
   */
	static async decryptText(key: CryptoKey, text: string): Promise<ActionResult<string>> {
		const data = JSON.parse(text)
		const result = await WebCrypto.decrypt(key, data)

		return {
			success: true,
			data: result
		}
	}

	/**
   * Encrypt the given data.
   *
   * @param key
   * @param data
   */
	static async encryptData<T>(key: CryptoKey, data: T): Promise<ActionResult<string>> {
		const dataString = JSON.stringify(data)
		return LocalfulEncryption.encryptText(key, dataString)
	}

	/**
   * Decrypt and validate the given data.
   *
   * @param key
   * @param schema
   * @param ciphertext
   */
	static async decryptAndValidateData<T>(
		key: CryptoKey,
		schema: z.ZodType<T>,
		ciphertext: string
	): Promise<ActionResult<T>> {
		const decryptResult = await LocalfulEncryption.decryptText(key, ciphertext)
		if (!decryptResult.success) return decryptResult

		let rawData
		try {
			rawData = JSON.parse(decryptResult.data)
		}
		catch (e) {
			return {
				success: false,
				errors: [{
					type: ErrorTypes.INVALID_OR_CORRUPTED_DATA,
					devMessage: "attempted to decrypt data that could not be parsed"
				}]
			}
		}

		const parseResult = schema.safeParse(rawData)
		if (parseResult.success) {
			return {
				success: true,
				data: parseResult.data
			}
		}

		return {
			success: false,
			errors: [{
				type: ErrorTypes.INVALID_OR_CORRUPTED_DATA,
				devMessage: "decrypted data failed validation",
				context: parseResult.error
			}]
		}
	}

	/**
   * Generate a random UUID value.
   */
	static generateUUID(): string {
		return self.crypto.randomUUID()
	}
}

window.LocalfulEncryption = LocalfulEncryption
