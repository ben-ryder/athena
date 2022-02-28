import aes from "crypto-js/aes";
import utf8 from "crypto-js/enc-utf8";


export class AthenaEncryption {
    static encryptText(key: string, text: string): string {
        return aes.encrypt(text, key).toString();
    }

    static decryptText(key: string, cipherText: string): string {
        return aes.decrypt(cipherText, key).toString(utf8);
    }

    static encryptData<Type>(key: string, data: Type): string {
        return aes.encrypt(JSON.stringify(data), key).toString();
    }

    static decryptData<Type>(key: string, cipherText: string): Type {
        return JSON.parse(
            aes.decrypt(cipherText, key).toString(utf8)
        );
    }
}
