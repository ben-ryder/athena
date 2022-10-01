import {AthenaEncryption} from "../encryption";


test('encrypt and decrypt a string', () => {
    const secret = "ibiova86g9q438ogr8wofw4";
    const inputText = "this is some test data";

    const cipherText = AthenaEncryption.encryptText(secret, inputText);
    const decryptedText = AthenaEncryption.decryptText(secret, cipherText);

    expect(decryptedText).toBe(inputText);
})

test('encrypt and decrypt a number', () => {
    const secret = "sjdfboa68934giu4twc";
    const inputNumber = 42.22;

    const cipherText = AthenaEncryption.encryptData<number>(secret, inputNumber);
    const decryptedNumber = AthenaEncryption.decryptData<number>(secret, cipherText);

    expect(inputNumber).toBe(decryptedNumber);
})

test('encrypt and decrypt an object', () => {
    const secret = "szdjnviusvg8aie4lkhtbwvioevhk4swtc9goilkshv4t";

    interface InputObject {
        testField: string,
        count: number,
        isThing: boolean,
        nested: {
            anotherField: string;
        }
    }

    const inputObject = <InputObject> {
        testField: "test-value",
        count: 2,
        nested: {
            anotherField: "text"
        }
    };

    const cipherText = AthenaEncryption.encryptData<InputObject>(secret, inputObject);
    const decryptedObject = AthenaEncryption.decryptData<InputObject>(secret, cipherText);

    expect(decryptedObject).toEqual(inputObject);
})
