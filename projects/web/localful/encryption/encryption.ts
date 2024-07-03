import { z } from "zod";

// todo: handle errors better, such as re-throwing web crypto errors with extra app specific context?

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

/**
 *
 * Thanks to the following resources which were used to refine this implementation:
 * - https://github.com/AKASHAorg/easy-web-crypto
 * - https://developer.mozilla.org/en-US/docs/Glossary/Base64
 */
export class LocalfulEncryption {

	static generateUUID(): string {
		return self.crypto.randomUUID()
	}

	static async createProtectedEncryptionKey(password: string): Promise<CreatedEncryptionKey> {
		const encryptionKey = await LocalfulEncryption._createEncryptionKey()
		const unlockKey = await LocalfulEncryption._deriveUnlockKey(password)
		const protectedEncryptionKey = await LocalfulEncryption._wrapEncryptionKey(encryptionKey, unlockKey)

		return {
			encryptionKey,
			protectedEncryptionKey
		}
	}

	static async decryptProtectedEncryptionKey(protectedEncryptionKey: string, password: string): Promise<string> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- version may be used in future
		const [version, base64Metadata, based64WrappedKey] = protectedEncryptionKey.split(":")

		const rawMetadata = LocalfulEncryption._base64ToBytes(base64Metadata)
		const metadata = UnlockKeyMetadata.parse(JSON.parse(new TextDecoder().decode(rawMetadata)))
		const unlockKey = await LocalfulEncryption._deriveUnlockKey(password, metadata.salt)

		return await LocalfulEncryption._decryptWithKey(unlockKey.key, based64WrappedKey)
	}

	static async updateProtectedEncryptionKey(protectedEncryptionKey: string, currentPassword: string, newPassword: string): Promise<CreatedEncryptionKey> {
		const encryptionKey = await LocalfulEncryption.decryptProtectedEncryptionKey(protectedEncryptionKey, currentPassword)
		const newUnlockKey = await LocalfulEncryption._deriveUnlockKey(newPassword)
		const newProtectedEncryptionKey = await LocalfulEncryption._wrapEncryptionKey(encryptionKey, newUnlockKey)

		// The stored encryption key doesn't change, but a CreatedEncryptionKey is still returned for consistency with the createProtectedEncryptionKey method.
		return {
			encryptionKey,
			protectedEncryptionKey: newProtectedEncryptionKey
		}
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
		const keyMaterial = window.crypto.getRandomValues(new Uint8Array(32));
		const base64Key = LocalfulEncryption._bytesToBase64(keyMaterial)
		return `v1.${base64Key}`
	}

	private static _getEncryptionCryptoKey(encryptionKeyString: string): Promise<CryptoKey> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- version isn't used, but may be needed in the future.
		const [version, base64Key] = encryptionKeyString.split('.')
		const keyMaterial = LocalfulEncryption._base64ToBytes(base64Key)

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
		const enc = new TextEncoder()

		const baseKey = await window.crypto.subtle.importKey(
			"raw",
			enc.encode(password),
			"PBKDF2",
			false,
			["deriveKey", "deriveBits"]
		)

		const salt = derivationSalt
			? LocalfulEncryption._base64ToBytes(derivationSalt)
			: window.crypto.getRandomValues(new Uint8Array(16));
		const encodedSalt = derivationSalt || LocalfulEncryption._bytesToBase64(salt)

		const derivedKey = await window.crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: salt,
				iterations: 100000,
				hash: "SHA-256",
			},
			baseKey,
			{ 'name': 'AES-GCM', 'length': 256 },
			true,
			// Although this key used to wrap the encryption key, the wrapping is done
			// via the _encryptWithKey and _decryptWithKey methods not the SubtleCrypto wrapKey/unwrapKey methods
			// so the key usage just needs to encrypt/decrypt.
			["encrypt", "decrypt"]
		)

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
		const base64WrappedKey = await LocalfulEncryption._encryptWithKey(unlockKey.key, encryptionKey)

		const encodedMetadata = new TextEncoder().encode(JSON.stringify(unlockKey.metadata))
		const base64Metadata = LocalfulEncryption._bytesToBase64(encodedMetadata)

		return `v1:${base64Metadata}:${base64WrappedKey}`
	}

	private static async _encryptWithKey<T>(key: CryptoKey, data: T): Promise<string> {
		const iv = window.crypto.getRandomValues(new Uint8Array(12));

		const cipherTextBuffer = await window.crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv
			},
			key,
			new TextEncoder().encode(JSON.stringify(data))
		)
		const base64CipherText = LocalfulEncryption._bytesToBase64(new Uint8Array(cipherTextBuffer))

		const base64Iv = LocalfulEncryption._bytesToBase64(iv)

		const metadata: EncryptionMetadata = {
			algo: "AES-GCM",
			iv: base64Iv,
		}
		const encodedMetadata = new TextEncoder().encode(JSON.stringify(metadata))
		const base64Metadata = LocalfulEncryption._bytesToBase64(encodedMetadata)

		return `v1.${base64Metadata}.${base64CipherText}`
	}

	private static async _decryptWithKey(
		key: CryptoKey,
		ciphertext: string,
	): Promise<string> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- may be used in future
		const [version, base64Metadata, base64CipherText] = ciphertext.split(".")

		const decodedMetadata = LocalfulEncryption._base64ToBytes(base64Metadata)
		const metadata = EncryptionMetadata.parse(JSON.parse(new TextDecoder().decode(decodedMetadata)))

		const cipherText = LocalfulEncryption._base64ToBytes(base64CipherText)
		const iv = LocalfulEncryption._base64ToBytes(metadata.iv)

		const decryptedData = await window.crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv,
			},
			key,
			cipherText
		)

		return JSON.parse(new TextDecoder().decode(decryptedData))
	}

	private static _bytesToBase64(byteArray: Uint8Array): string {
		const binString = Array.from(byteArray, (byte) =>
			String.fromCodePoint(byte),
		).join("");
		return btoa(binString);
	}

	private static _base64ToBytes(base64String: string): Uint8Array {
		const binString = atob(base64String);
		// @ts-expect-error -- this is copied from MDN (https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem) and does work.
		return Uint8Array.from(binString, (m) => m.codePointAt(0));
	}
}
