<!--
SPDX-FileCopyrightText: 2022 Andre 'Staltz' Medeiros <contact@staltz.com>

SPDX-License-Identifier: CC0-1.0
-->

# ssb-feed-format

A tool that you install as a devDependency to check whether your feed format for
SSB is correct and ready to be installed in ssb-db2.

This tool helps you create new feed formats that are compatible with ssb-db2 (and maybe one day other databases).

## Installation

```bash
npm install --save-dev ssb-feed-format
```

## Usage

```js
const {check} = require('ssb-feed-format')

const myFeedFormat = {
  // ...
}

check(
  // Pass your feed format:
  myFeedFormat,
  // Pass a function that generates correct keys for your feed format:
  () => ssbKeys.generate(null, null, 'myformat')
  (err) => {
    // `err` if the format is incorrect, else it is undefined
  }
)
```

## Spec

A **feed format** defines how to create messages that follow a particular *shape*. Every feed format is a plugin-like object with:

- `name`
- `encodings`
- Functions to create and convert "native messages":
  - `newNativeMsg`
  - `toNativeMsg`
  - `fromNativeMsg`
- Encryption-related function:
  - `toPlaintextBuffer`
  - `fromDecryptedNativeMsg`
- Helper functions to `get` and check `is`
  - `getFeedId`
  - `getMsgId`
  - `isNativeMsg`
  - `isAuthor`
- Validation functions
  - `validate()` **required**
  - `validateOOO()` **optional**
  - `validateBatch()` **optional**
  - `validateOOOBatch()` **optional**

:star: A **"native message"** (also known as `nativeMsg`) is a message owned by the feed format. The shape of the native message can be **whatever** you want for your feed format, but it must be able to **convert** from-and-to encodings such as the classic "msg.value" in SSB (a JSON object as specified by the protocol guide).

Examples:

- For "classic", a nativeMsg is the traditional JavaScript **object** `msgVal`
- For "bendybutt-v1", a nativeMsg is a BFE-and-bencoded **buffer** with a shape determined by [bendy-butt-spec](https://github.com/ssb-ngi-pointer/bendy-butt-spec)

On top of that, there are additional restrictions to your feed format. Unfortunately, you can't express *all possible* feed formats with this tool, only a subset which fits well in ssb-db2. The following rules apply:

- The native message MUST convert to the "JS" encoding, i.e. a JavaScript object following the [protocol guide's message format](https://ssbc.github.io/scuttlebutt-protocol-guide/#message-format)
- Lipmaa links are NOT supported, your feed format has to do simple chaining, using the `previous` field
- A feed ID must always be SSB URIs or classic sigil IDs
- A message ID must always be SSB URIs or classic sigil IDs

## Fields and functions

Your feed format must include these properties:

### `name`

A **string** to name this format. Try to use computer-friendly names, not human-friendly names. Avoid spaces, and prefer lowercase and short unique names.

### `encodings`

An **array** of supported encoding names, each as a **string**. This array MUST
always include at least the string `'js'`.

### `newNativeMsg(opts)`

Mint a new native message and return it, based on the inputs given in the `opts` object. You can typically rely on `opts` containing the fields:

- `opts.keys`: cryptographic keys owning the feed
- `opts.keys.id`: feed ID (or "author" ID)
- `opts.timestamp`: time the message is/was created. Number of milliseconds since 1 January 1970 00:00 UTC.
- `opts.content`: free-form JavaScript object for the content part of the message
- `opts.previous`: JS-encoded "KVT" of the previous message on this feed
- `opts.hmacKey`: optional HMAC key

The native message returned by this function SHOULD be already "valid" and we ASSUME it *would* pass the `validate` function.

### `toNativeMsg(msg, encoding)`

Given a `msg` encoded with `encoding`, this function should return a native message.

We recommend that `encoding` is allowed be undefined, in which case it would default to the value `'js'`.

### `fromNativeMsg(nativeMsg, encoding)`

Given a `nativeMsg`, this function should encode it with `encoding` and return the corresponding encoded message. For instance, typically `encoding` is `'js'` and in that case it should return a classic JavaScript SSB message object.

We recommend that `encoding` is allowed be undefined, in which case it would default to the value `'js'`.

### `toPlaintextBuffer(opts)`

Useful in the context of encrypting your native message, this function takes `opts` (same as `newNativeMsg`'s input) and should return a Buffer representing the "plaintext" of the message's content, ready for encryption.

### `fromDecryptedNativeMsg(plaintextBuf, nativeMsg, encoding)`

Useful in the context of decrypting your native message, this function takes a
`plaintextBuf` (buffer, already decrypted from the ciphertext), a `nativeMsg`, and the target `encoding`, and should return the corresponding encoded message.

This is typically used for "fitting in" the decrypted "content" back into the nativeMsg, as it appeared to be right before it was encrypted.

We recommend that `encoding` is allowed be undefined, in which case it would default to the value `'js'`.

### `getFeedId(nativeMsg)`

Given a `nativeMsg`, this function should return a string (either a sigil ID or an SSB URI) representing the feed ID that owns that `nativeMsg`.

### `getMsgId(nativeMsg)`

Given a `nativeMsg`, this function should return a string (either a sigil ID or an SSB URI) determined as the identifier for the `nativeMsg`.

### `getSequence(nativeMsg)`

Given a `nativeMsg`, this function should return a non-negative integer determined as the counter for this `nativeMsg` in the feed.

### `isNativeMsg(x)`

Given any JavaScript value `x`, this function should return `true` when it detects that `x` satisfies all the criteria to be considered a native message belonging to your feed format. Otherwise, should return `false`.

### `isAuthor(author)`

Given a string (a sigil ID or an SSB URI), this function should return `true` if the string is uniquely belonging to this feed format, otherwise it should return `false`.

### `validate(nativeMsg, previousNativeMsg, hmacKey, cb)`

Given a `nativeMsg`, its `previousNativeMsg` (in the feed's sequence of messages, also known as the "latest message", which COULD be `null`), and an optional `hmacKey`, this function should perform thorough validation of the `nativeMsg`, including cryptographic sig-chain verification. If validation passes, you should call `cb()` with no arguments. If validation failed, you should pass an error `err` when calling `cb(err)`.

### `validateBatch(nativeMsgs, previousNativeMsg, hmacKey, cb)`

THIS FUNCTION IS OPTIONAL, YOU DON'T NEED TO IMPLEMENT IT.

Given an **array** of `nativeMsgs`, the `previousNativeMsg`, and an optional `hmacKey`, this function should perform validation of several native messages at once. If validation passes for all of them, call `cb()`. Else, call `cb(err)` with the specific error `err`.

### `validateOOO(nativeMsg, hmacKey, cb)`

THIS FUNCTION IS OPTIONAL, YOU DON'T NEED TO IMPLEMENT IT.

Given a `nativeMsg` and an optional `hmacKey`, this function should perform light validation of the `nativeMsg`, except cryptographic sig-chain verification. If validation passes for all of them, call `cb()`. Else, call `cb(err)` with the specific error `err`.

### `validateOOOBatch(nativeMsgs, hmacKey, cb)`

THIS FUNCTION IS OPTIONAL, YOU DON'T NEED TO IMPLEMENT IT.

Given an **array** of `nativeMsgs` and an optional `hmacKey`, this function should perform light validation of several native messages at once, except cryptographic sig-chain verification. If validation passes for all of them, call `cb()`. Else, call `cb(err)` with the specific error `err`.

## License

LGPL-3.0-only