/**
 * This file monkey patches the global scope to include the Node.js Web Crypto API, TextDecoder & TextEncoder implementations.
 * It is required because jest/jsdom doesn't expose these browser APIs, but they're required by the encryption features in Localful.
 *
 * Thanks to https://svenbuschbeck.net/blog/2023-02-20-jest-and-crypto/ for
 * their blog post showing how to implement this.
 */

import { TextDecoder, TextEncoder } from 'util';
import { webcrypto } from 'crypto'

Object.defineProperty(globalThis, 'TextDecoder', {
	value: TextDecoder,
});

Object.defineProperty(globalThis, 'TextEncoder', {
	value: TextEncoder,
});

Object.defineProperty(globalThis, 'crypto', {
	value: webcrypto,
});