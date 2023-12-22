import {EncryptionHelper} from "./encryption-helper";


test('encrypt and decrypt a string', async () => {
    const key = await EncryptionHelper.generateVaultEncryptionKey()
    const inputText = "this is some test data";

    console.log("test")

    const encrypted = await EncryptionHelper.encryptVaultText(inputText, key);
    const decryptedText = await EncryptionHelper.decryptVaultText(encrypted, key);

    expect(decryptedText).toBe(inputText);
})
