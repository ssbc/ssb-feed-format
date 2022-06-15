// SPDX-FileCopyrightText: 2022 Andre 'Staltz' Medeiros <contact@staltz.com>
//
// SPDX-License-Identifier: CC0-1.0

const test = require('tape');
const Ref = require('ssb-ref');
const validate2 = require('ssb-validate2');
const ssbKeys = require('ssb-keys');
const {check} = require('../');

const feedFormat = {
  name: 'classic',
  encodings: ['js'],

  getFeedId(nativeMsg) {
    return nativeMsg.author;
  },

  getMsgId(nativeMsg) {
    return '%' + ssbKeys.hash(JSON.stringify(nativeMsg, null, 2));
  },

  getSequence(nativeMsg) {
    return nativeMsg.sequence;
  },

  isNativeMsg(x) {
    return typeof x === 'object' && !!x && Ref.isFeedId(x.author);
  },

  isAuthor(author) {
    return Ref.isFeedId(author);
  },

  toPlaintextBuffer(opts) {
    return Buffer.from(JSON.stringify(opts.content), 'utf8');
  },

  newNativeMsg(opts) {
    const previous = opts.previous || {key: null, value: {sequence: 0}};
    const nativeMsg = {
      previous: previous.key,
      sequence: previous.value.sequence + 1,
      author: opts.keys.id,
      timestamp: +opts.timestamp,
      hash: 'sha256',
      content: opts.content,
    };
    return ssbKeys.signObj(opts.keys, opts.hmacKey, nativeMsg);
  },

  fromNativeMsg(nativeMsg, encoding) {
    if (encoding === 'js') {
      return nativeMsg;
    } else {
      throw new Error('doesnt support encoding ' + encoding);
    }
  },

  fromDecryptedNativeMsg(plaintextBuf, nativeMsg, encoding) {
    if (encoding === 'js') {
      const msgVal = nativeMsg;
      const content = JSON.parse(plaintextBuf.toString('utf8'));
      msgVal.content = content;
      return msgVal;
    } else {
      throw new Error('doesnt support encoding ' + encoding);
    }
  },

  toNativeMsg(msg, encoding) {
    if (encoding === 'js') {
      return msg;
    } else {
      throw new Error('doesnt support encoding ' + encoding);
    }
  },

  validateBatch: validate2.validateBatch,
  validateOOOBatch: validate2.validateOOOBatch,
  validate: validate2.validateSingle,
};

test('classic format passes the checks', (t) => {
  t.doesNotThrow(() => {
    check(feedFormat, () => ssbKeys.generate());
  });
  t.end();
});

test('corrupted fromNativeMsg is detected', (t) => {
  const corruptedFeedFormat = Object.create(feedFormat);
  corruptedFeedFormat.fromNativeMsg = function (nativeMsg) {
    return {...nativeMsg, author: 'wrong'};
  };

  t.throws(() => {
    check(corruptedFeedFormat, () => ssbKeys.generate());
  }, /fromNativeMsg\(\) JS-encoding must return an object with msgVal\.author/);
  t.end();
});

test('corrupted toNativeMsg is detected', (t) => {
  const corruptedFeedFormat = Object.create(feedFormat);
  corruptedFeedFormat.toNativeMsg = function (msg) {
    return Buffer.from(JSON.stringify(msg), 'utf-8');
  };

  t.throws(() => {
    check(corruptedFeedFormat, () => ssbKeys.generate());
  }, /fromNativeMsg\(\) and toNativeMsg\(\) are not each other's inverse/);
  t.end();
});
