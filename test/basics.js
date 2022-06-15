// SPDX-FileCopyrightText: 2022 Andre 'Staltz' Medeiros <contact@staltz.com>
//
// SPDX-License-Identifier: CC0-1.0

const test = require('tape');
const ssbKeys = require('ssb-keys');
const Ref = require('ssb-ref');
const {check} = require('../');

test('name missing', (t) => {
  t.throws(() => {
    check({}, ssbKeys.generate);
  }, /requires the field "name" as a string/);
  t.end();
});

test('encodings missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
      },
      ssbKeys.generate,
    );
  }, /requires "encodings" as an array/);
  t.end();
});

test('getFeedId missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
      },
      ssbKeys.generate,
    );
  }, /requires "getFeedId" as a function/);
  t.end();
});

test('getMsgId missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "getMsgId" as a function/);
  t.end();
});

test('getSequence missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "getSequence" as a function/);
  t.end();
});

test('isNativeMsg missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "isNativeMsg" as a function/);
  t.end();
});

test('isAuthor missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "isAuthor" as a function/);
  t.end();
});

test('toPlaintextBuffer missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "toPlaintextBuffer" as a function/);
  t.end();
});

test('newNativeMsg missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "newNativeMsg" as a function/);
  t.end();
});

test('fromNativeMsg missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "fromNativeMsg" as a function/);
  t.end();
});

test('fromDecryptedNativeMsg missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "fromDecryptedNativeMsg" as a function/);
  t.end();
});

test('toNativeMsg missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "toNativeMsg" as a function/);
  t.end();
});

test('validateSingle missing', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
      },
      ssbKeys.generate,
    );
  }, /requires "validateSingle" as a function/);
  t.end();
});

test('encodings missing "js"', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['bipf'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /must support JS encoding/);
  t.end();
});

test('isAuthor cant return undefined', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => {},
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /must return true for isAuthor/);
  t.end();
});

test('isAuthor cant return true for everything', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: () => true,
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /isAuthor\(\) must return false for nonsense inputs/);
  t.end();
});

test('isNativeMsg must say "true" to a newNativeMsg output', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => {},
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: () => {},
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /must return true for isNativeMsg\(\) for a nativeMsg/);
  t.end();
});

test('isNativeMsg cant return true for everything', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: () => true,
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: () => 'I am a native msg',
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /isNativeMsg\(\) must return false for nonsense inputs/);
  t.end();
});

test('getFeedId must return a string', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => {},
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: (x) => x === 'I am a native msg',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: () => 'I am a native msg',
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /getFeedId\(\) must return a string/);
  t.end();
});

test('getFeedId must return an SSB URI or sigil', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => 'Feed id',
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: (x) => x === 'I am a native msg',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: () => 'I am a native msg',
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /getFeedId\(\) must return either a sigil ID or an SSB URI/);
  t.end();
});

test('getFeedId must the correct feed ID, not a random one', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: () => ssbKeys.generate().id,
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: (x) => x === 'I am a native msg',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: () => 'I am a native msg',
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /getFeedId\(\) must return the correct feed ID/);
  t.end();
});

test('getMsgId must return a string', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => {},
        getSequence: () => {},
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /getMsgId\(\) must return a string/);
  t.end();
});

test('getMsgId must return an SSB URI or a sigil ID', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'message id',
        getSequence: () => {},
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /getMsgId\(\) must return either a sigil ID or an SSB URI/);
  t.end();
});

test('getSequence must return a number', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => {},
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /getSequence\(\) must return the number 1/);
  t.end();
});

test('toPlaintextBuffer must return a Buffer', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => {},
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /toPlaintextBuffer\(\) must return a Buffer/);
  t.end();
});

test('fromNativeMsg must return an object', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: () => {},
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object but/);
  t.end();
});

test('fromNativeMsg requires msgVal.author', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: () => ({age: 10}),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal.author/);
  t.end();
});

test('fromNativeMsg requires msgVal.sequence', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: (nativeMsg) => ({author: nativeMsg.author, age: 10}),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal.sequence/);
  t.end();
});

test('fromNativeMsg requires msgVal.previous', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: (nativeMsg) => ({
          author: nativeMsg.author,
          sequence: 1,
          age: 10,
        }),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal.previous/);
  t.end();
});

test('fromNativeMsg requires a msgVal.previous string', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: (nativeMsg) => ({
          author: nativeMsg.author,
          sequence: 1,
          previous: 'fofofofof',
          age: 10,
        }),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal.previous as a sigil ID or SSB URI/);
  t.end();
});

test('fromNativeMsg requires msgVal.timestamp', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: (nativeMsg) => ({
          author: nativeMsg.author,
          sequence: 1,
          previous: null,
          age: 10,
        }),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal.timestamp/);
  t.end();
});

test('fromNativeMsg requires msgVal.content', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: (nativeMsg) => ({
          author: nativeMsg.author,
          sequence: 1,
          previous: null,
          timestamp: 192317259,
          age: 10,
        }),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal.content/);
  t.end();
});

test('fromNativeMsg and toNativeMsg must be inverse', (t) => {
  t.throws(() => {
    check(
      {
        name: 'cool',
        encodings: ['js'],
        getFeedId: (nativeMsg) => nativeMsg.author,
        getMsgId: () => 'ssb:message/cool/12391281830',
        getSequence: () => 1,
        isNativeMsg: (x) => typeof x === 'object',
        isAuthor: Ref.isFeedId,
        toPlaintextBuffer: () => Buffer.from([0]),
        newNativeMsg: (opts) => ({author: opts.keys.id}),
        fromNativeMsg: (nativeMsg) => ({
          author: nativeMsg.author,
          sequence: 1,
          previous: null,
          timestamp: 192317259,
          content: {type: 'post', text: 'hello world'},
          age: 10,
        }),
        fromDecryptedNativeMsg: () => {},
        toNativeMsg: () => {},
        validateSingle: () => {},
      },
      ssbKeys.generate,
    );
  }, /fromNativeMsg\(\) and toNativeMsg\(\) are not each other's inverse/);
  t.end();
});
