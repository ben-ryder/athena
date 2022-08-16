import aes from "crypto-js/aes";
import sha256 from "crypto-js/sha256";
import pbkdf2 from "crypto-js/pbkdf2";
import {random} from "crypto-js/lib-typedarrays";
import utf8 from "crypto-js/enc-utf8";

import { AthenaDecryptError, AthenaEncryptError } from "./errors";
import {VaultDto} from "./schemas/vaults/dtos/vault.dto";
import {CreateVaultRequest} from "./schemas/vaults/request/create.vaults.request";
import {UpdateVaultRequest} from "./schemas/vaults/request/update.vaults.request";
import {CreateNoteRequest} from "./schemas/notes/request/create.notes.request";
import {UpdateNoteRequest} from "./schemas/notes/request/update.notes.request";
import {NoteDto} from "./schemas/notes/dtos/note.dto";
import {NoteContentDto} from "./schemas/notes/dtos/note-content.dto";
import {TemplateDto} from "./schemas/templates/dtos/template.dto";
import {TemplateContentDto} from "./schemas/templates/dtos/template-content.dto";
import {UpdateTemplateRequest} from "./schemas/templates/request/update.templates.request";
import {CreateTemplateRequest} from "./schemas/templates/request/create.templates.request";

export interface AccountKeys {
    masterKey: string,
    serverPassword: string,
}

export const EncryptionKeyByteNumber = 64;
export const PasswordKeySize = 32;


export class AthenaEncryption {

    // Basic Text Hashing
    static hashText(text: string): string {
        return sha256(text).toString(utf8);
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

    // Vault Encryption
    static encryptCreateVaultRequest(key: string, createVaultRequest: CreateVaultRequest): CreateVaultRequest {
        return {
            name: AthenaEncryption.encryptText(key, createVaultRequest.name),
            description: createVaultRequest.description ? AthenaEncryption.encryptText(key, createVaultRequest.description) : undefined
        }
    }

    static encryptUpdateVaultRequest(key: string, updateVaultRequest: UpdateVaultRequest): UpdateVaultRequest {
        const encryptedUpdate: UpdateVaultRequest = {};

        if (updateVaultRequest.name) {
            encryptedUpdate.name = AthenaEncryption.encryptText(key, updateVaultRequest.name)
        }

        if (typeof updateVaultRequest.description !== 'string' || updateVaultRequest.description === "") {
            encryptedUpdate.description = updateVaultRequest.description
        }
        else {
            encryptedUpdate.description = AthenaEncryption.encryptText(key, updateVaultRequest.description);
        }

        return encryptedUpdate;
    }

    static decryptVault(key: string, vault: VaultDto): VaultDto {
        const decryptedVaultContent = {
            name: AthenaEncryption.decryptText(key, vault.name),
            description: vault.description ? AthenaEncryption.decryptText(key, vault.description) : null
        }

        // If the title is empty then the decryption key must be wrong.
        if (decryptedVaultContent.name === '') {
            throw new AthenaDecryptError();
        }

        return {
            ...vault,
            ...decryptedVaultContent
        };
    }

    // Note Encryption
    static encryptCreateNoteRequest(key: string, createNoteRequest: CreateNoteRequest): CreateNoteRequest {
        return {
            ...createNoteRequest,
            title: AthenaEncryption.encryptText(key, createNoteRequest.title),
            description: createNoteRequest.description ? AthenaEncryption.encryptText(key, createNoteRequest.description) : undefined,
            body: AthenaEncryption.encryptText(key, createNoteRequest.body),
        }
    }

    static encryptUpdateNoteRequest(key: string, updateNoteRequest: UpdateNoteRequest): UpdateNoteRequest {
        if (updateNoteRequest.title) {
            updateNoteRequest.title = AthenaEncryption.encryptText(key, updateNoteRequest.title)
        }
        if (typeof updateNoteRequest.description === 'string' && updateNoteRequest.description !== "") {
            updateNoteRequest.description = AthenaEncryption.encryptText(key, updateNoteRequest.description);
        }
        if (updateNoteRequest.body) {
            updateNoteRequest.body = AthenaEncryption.encryptText(key, updateNoteRequest.body)
        }

        return updateNoteRequest;
    }

    static decryptNote(key: string, note: NoteDto): NoteDto {
        const decryptedContent: NoteContentDto = {
            title: AthenaEncryption.decryptText(key, note.title),
            description: note.description ? AthenaEncryption.decryptText(key, note.description) : null,
            body: AthenaEncryption.decryptText(key, note.body)
        }

        // If the content is empty then the decryption key must be wrong.
        if (
          decryptedContent.title === "" ||
          decryptedContent.description === "" ||
          decryptedContent.body === ""
        ) {
            throw new AthenaDecryptError();
        }

        return {
            ...note,
            ...decryptedContent
        };
    }

    // Template Encryption
    static encryptCreateTemplateRequest(key: string, createTemplateRequest: CreateTemplateRequest): CreateTemplateRequest {
        return {
            ...createTemplateRequest,
            title: AthenaEncryption.encryptText(key, createTemplateRequest.title),
            description: createTemplateRequest.description ? AthenaEncryption.encryptText(key, createTemplateRequest.description) : undefined,
            body: AthenaEncryption.encryptText(key, createTemplateRequest.body),
        }
    }

    static encryptUpdateTemplateRequest(key: string, updateTemplateRequest: UpdateTemplateRequest): UpdateTemplateRequest {
        if (updateTemplateRequest.title) {
            updateTemplateRequest.title = AthenaEncryption.encryptText(key, updateTemplateRequest.title)
        }
        if (typeof updateTemplateRequest.description === 'string' && updateTemplateRequest.description !== "") {
            updateTemplateRequest.description = AthenaEncryption.encryptText(key, updateTemplateRequest.description);
        }
        if (updateTemplateRequest.body) {
            updateTemplateRequest.body = AthenaEncryption.encryptText(key, updateTemplateRequest.body)
        }

        return updateTemplateRequest;
    }

    static decryptTemplate(key: string, template: TemplateDto): TemplateDto {
        const decryptedContent: TemplateContentDto = {
            title: AthenaEncryption.decryptText(key, template.title),
            description: template.description ? AthenaEncryption.decryptText(key, template.description) : null,
            body: AthenaEncryption.decryptText(key, template.body)
        }

        // If the content is empty then the decryption key must be wrong.
        if (
          decryptedContent.title === "" ||
          decryptedContent.description === "" ||
          decryptedContent.body === ""
        ) {
            throw new AthenaDecryptError();
        }

        return {
            ...template,
            ...decryptedContent
        };
    }
}
