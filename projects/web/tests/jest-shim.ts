/**
 * This shim implements exposed the Node Web Crypto API, TextDecoder & TextEncoder implementations
 *
 * Thanks to https://svenbuschbeck.net/blog/2023-02-20-jest-and-crypto/
 *
 */

import { TextDecoder, TextEncoder } from 'util';
import { webcrypto } from 'crypto'

Object.defineProperty(globalThis, 'TextDecoder', {
	value: TextDecoder,
});

Object.defineProperty(globalThis, 'TextDecoder', {
	value: TextDecoder,
});

Object.defineProperty(globalThis, 'crypto', {
	value: webcrypto,
});