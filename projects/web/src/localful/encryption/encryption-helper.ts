import { DecryptError, EncryptError } from "../common/errors";

const INITIALIZATION_VECTOR_LENGTH = 12;
const SALT_LENGTH = 16;

/**
 * A helper class which contains the cryptographic functions used
 * to encrypt and decrypt data.
 */
export class EncryptionHelper {
    /**
     * Encrypt text using the vault encryption key.
     * The returned string will include the encrypted text and initialization vector combined.
     *
     * @param text
     * @param vaultEncryptionKey
     * @throws EncryptError
     */
    static async encryptVaultText(text: string, vaultEncryptionKey: CryptoKey): Promise<string> {
        const encodedText = new TextEncoder().encode(text);
        const iv = window.crypto.getRandomValues(new Uint8Array(INITIALIZATION_VECTOR_LENGTH));

        const resultBuffer = await window.crypto.subtle.encrypt(
          {
              name: "AES-GCM",
              iv
          },
          vaultEncryptionKey,
          encodedText
        )

        return EncryptionHelper._packEncryptedText(resultBuffer, iv);
    }

    /**
     * Decrypt text using the vault encryption key.
     * The passed string should include the encrypted text, salt and initialization vector.
     *
     * @param text
     * @param vaultEncryptionKey
     * @throws DecryptError
     */
    static async decryptVaultText(text: string, vaultEncryptionKey: CryptoKey): Promise<string> {
        const {encryptedBuffer, iv} = await EncryptionHelper._unpackEncryptedText(text);

        const resultBuffer = await window.crypto.subtle.decrypt(
          {
              name: "AES-GCM",
              iv
          },
          vaultEncryptionKey,
          encryptedBuffer
        )

        return EncryptionHelper._arrayBufferToText(resultBuffer)
    }

    /**
     * Encrypt the vault encryption key using the profile encryption key.
     *
     * @param profileEncryptionKey
     * @param vaultEncryptionKey
     */
    static async encryptVaultEncryptionKey(vaultEncryptionKey: CryptoKey, profileEncryptionKey: CryptoKey): Promise<string> {

    }

    /**
     * Decrypt the vault encryption key using the profile encryption key.
     *
     * @param encryptedVaultEncryptionKey
     * @param profileEncryptionKey
     */
    static async decryptVaultEncryptionKey(encryptedVaultEncryptionKey: CryptoKey, profileEncryptionKey: CryptoKey): Promise<string> {

    }

    /**
     * Generate a random vault encryption key used to encrypt vault content.
     */
    static async generateVaultEncryptionKey(): Promise<CryptoKey> {
        const key = await window.crypto.subtle.generateKey(
          {
            name: "AES-GCM",
            length: 256
          },
          true,
          ["encrypt", "decrypt"]
        )
    }

    /**
     * Derive the profile encryption key from teh user supplied secret.
     *
     * todo: I don't think this is correct yet. Need to brush up on PBKDF2 and key wrapping.
     *
     * @param userSecret
     */
    static async deriveProfileEncryptionKey(userSecret: string): Promise<CryptoKey> {
        const encodedText = new TextEncoder().encode(userSecret);

        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

        const baseKey = await window.crypto.subtle.importKey(
          "raw",
          encodedText,
          {name: "PBKDF2"},
          false,
          ['deriveBits', 'deriveKey']
        );

        return await window.crypto.subtle.deriveKey(
          {
              name: "PBKDF2",
              hash: "SHA-256",
              salt: salt,
              iterations: 100000,
          },
          baseKey,
          { 'name': 'AES-GCM', 'length': 256 },
          true,
          ["wrapKey", "unwrapKey"]
        );
    }

    static _packEncryptedText(encryptedBuffer: ArrayBuffer, iv: Uint8Array): string {
        // Prefix the encrypted buffer with the initialization vector, it can then be unpacked again later before decryption.
        const combinedBuffer = new Uint8Array(INITIALIZATION_VECTOR_LENGTH + encryptedBuffer.byteLength);
        combinedBuffer.set(new Uint8Array(iv), 0);
        combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.byteLength);

        return EncryptionHelper._arrayBufferToText(combinedBuffer);
    }

    static _unpackEncryptedText(encryptedText: string): {encryptedBuffer: ArrayBuffer, iv: Uint8Array } {
        const combinedBuffer = EncryptionHelper._textToArrayBuffer(encryptedText);
        const iv = new Uint8Array(combinedBuffer.slice(0, INITIALIZATION_VECTOR_LENGTH));
        const encryptedBuffer = combinedBuffer.slice(INITIALIZATION_VECTOR_LENGTH)

        return {encryptedBuffer, iv}
    }

    static _arrayBufferToText(arrayBuffer: ArrayBuffer): string {
        return new TextDecoder().decode(arrayBuffer);
    }

    static _textToArrayBuffer(text: string): ArrayBuffer {
        return new TextEncoder().encode(text);
    }

    /**
     * Generate a random UUID v4 value.
     */
    static async generateUUID(): Promise<string> {
        return window.crypto.randomUUID()
    }
}
