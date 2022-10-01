import aes from "crypto-js/aes";
import sha256 from "crypto-js/sha256";
import pbkdf2 from "crypto-js/pbkdf2";
import {random} from "crypto-js/lib-typedarrays";
import utf8 from "crypto-js/enc-utf8";

import { AthenaDecryptError, AthenaEncryptError } from "./errors";

export interface AccountKeys {
    masterKey: string,
    serverPassword: string,
}

export const EncryptionKeyByteNumber = 64;
export const PasswordKeySize = 32;


export class AthenaEncryption {

    // Basic Text Hashing
    static hashText(text: string): string {
        return sha256(text).toString();
    }

    // Basic Text Encryption
    static encryptText(key: string, text: string): string {
        try {
            return aes.encrypt(text, key).toString();
        }
        catch (e) {
            throw new AthenaEncryptError();
        }
    }

    static decryptText(key: string, cipherText: string): string {
        try {
            return aes.decrypt(cipherText, key).toString(utf8);
        }
        catch (e) {
            throw new AthenaDecryptError();
        }
    }

    // Basic Data Encryption
    static encryptData<Type>(key: string, data: Type): string {
        try {
            return aes.encrypt(JSON.stringify(data), key).toString();
        }
        catch (e) {
            throw new AthenaEncryptError();
        }
    }

    static decryptData<Type>(key: string, cipherText: string): Type {
        try {
            return JSON.parse(
                aes.decrypt(cipherText, key).toString(utf8)
            );
        }
        catch (e) {
            throw new AthenaDecryptError();
        }
    }

    // Generating a random encryption key
    static generateEncryptionKey(): string {
        return random(EncryptionKeyByteNumber).toString()
    }

    // Password key fetching
    static getPasswordKey(username: string, password: string): string {
        const words = pbkdf2(password, username, {keySize: PasswordKeySize})
        return words.toString()
    }

    // Account key fetching
    static getAccountKeys(username: string, password: string): AccountKeys {
        const passwordKey = AthenaEncryption.getPasswordKey(username, password);

        const cutIndex = Math.round(passwordKey.length / 2);
        const masterKey = passwordKey.substring(0, cutIndex);
        const serverPassword = passwordKey.substring(cutIndex, passwordKey.length - 1);

        return {
            masterKey,
            serverPassword
        }
    }
}
