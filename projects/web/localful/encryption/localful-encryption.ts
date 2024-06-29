import { ActionResult, ErrorTypes } from "../control-flow";
import { z } from "zod";
import * as WebCrypto from "easy-web-crypto"

/**
 * A helper class which contains the cryptographic functions used
 * to encrypt and decrypt data.
 */
export class LocalfulEncryption {
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
