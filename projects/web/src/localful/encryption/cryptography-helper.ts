import { ActionResult, ApplicationErrorType } from "../../state/actions";
import { z } from "zod";
import * as WebCrypto from "easy-web-crypto"

const passphrase = "super secure passphrase"
const encMasterKey = {"derivationParams":{"salt":"817004d86c216356b62cd3974342201b","iterations":100000,"hashAlgo":"SHA-256"},"encryptedMasterKey":{"ciphertext":"397fe7cade63bf6a893151636a1516307b03dd6b7fb79c5ed46db926bc69a9bf38607d1e598d3910a8eb75a808d20b89b64bc17ddd9f9abac7d7e8b5294bedb3b437f569e639676087907db56a6874a91bab","iv":"94ac25b2fd7a130c7ce27e7c"}}
export const EXAMPLE_KEY = await WebCrypto.decryptMasterKey(passphrase, encMasterKey)

/**
 * A helper class which contains the cryptographic functions used
 * to encrypt and decrypt data.
 */
export class CryptographyHelper {
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
    return CryptographyHelper.encryptText(key, dataString)
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
    const decryptResult = await CryptographyHelper.decryptText(key, ciphertext)
    if (!decryptResult.success) return decryptResult

    let rawData
    try {
      rawData = JSON.parse(decryptResult.data)
    }
    catch (e) {
      return {
        success: false,
        errors: [{
          type: ApplicationErrorType.INTERNAL_UNEXPECTED,
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
        type: ApplicationErrorType.INTERNAL_UNEXPECTED,
        devMessage: "decrypted data failed validation",
        context: parseResult.error
      }]
    }
  }

  /**
   * Generate a random UUID value.
   */
  static async generateUUID(): Promise<string> {
    return self.crypto.randomUUID()
  }
}
