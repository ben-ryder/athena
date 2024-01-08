import { z } from "zod";
import { ActionResult, ActionStatus, ApplicationErrorType } from "../../state/actions";

export const EXAMPLE_KEY = "KEY"

export class EncryptionHelper {

  static async encrypt<T>(key: string, data: T): Promise<ActionResult<string>> {
    const dataString = JSON.stringify(data)
    return {
      success: true,
      data: `enc_${dataString}`
    }
  }

  static async decryptAndValidateData<T extends z.ZodTypeAny>(
    key: string,
    schema: T,
    ciphertext: string
  ): Promise<ActionResult<T>> {
    const decryptedCipherText = await EncryptionHelper.decrypt(key, ciphertext)
    const rawData = JSON.parse(decryptedCipherText)
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

  static async decrypt(key: string, ciphertext: string): Promise<string> {
    return ciphertext.replace("enc_", "")
  }
}