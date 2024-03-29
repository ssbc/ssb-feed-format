// SPDX-FileCopyrightText: 2022 Andre 'Staltz' Medeiros <contact@staltz.com>
//
// SPDX-License-Identifier: LGPL-3.0-only

const {deepEqual} = require('fast-equals');
const Ref = require('ssb-ref');
const multicb = require('multicb');

const TEST_CONTENT = {type: 'post', text: 'hello world'};
/**
 * @typedef {Object} FeedFormat
 * @property {string} name
 * @property {Array<string>} encodings
 * @property {CallableFunction} isNativeMsg
 * @property {CallableFunction} isAuthor
 * @property {CallableFunction} getFeedId
 * @property {CallableFunction} getMsgId
 * @property {CallableFunction} getSequence
 * @property {CallableFunction} toPlaintextBuffer
 * @property {CallableFunction} newNativeMsg
 * @property {CallableFunction} fromNativeMsg
 * @property {CallableFunction} fromDecryptedNativeMsg
 * @property {CallableFunction} toNativeMsg
 * @property {CallableFunction} validate
 * @property {CallableFunction=} validateOOO
 * @property {CallableFunction=} validateBatch
 * @property {CallableFunction=} validateOOOBatch
 */

/**
 * @param {FeedFormat} ff
 */
function assertHasAllRequiredProps(ff) {
  if (!ff.name || typeof ff.name !== 'string') {
    throw new Error('Your feed format requires the field "name" as a string');
  }

  if (!ff.encodings || !Array.isArray(ff.encodings)) {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "encodings" as an array`);
  }

  if (!ff.getFeedId || typeof ff.getFeedId !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "getFeedId" as a function`);
  }

  if (!ff.getMsgId || typeof ff.getMsgId !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "getMsgId" as a function`);
  }

  if (!ff.getSequence || typeof ff.getSequence !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "getSequence" as a function`);
  }

  if (!ff.isNativeMsg || typeof ff.isNativeMsg !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "isNativeMsg" as a function`);
  }

  if (!ff.isAuthor || typeof ff.isAuthor !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "isAuthor" as a function`);
  }

  if (!ff.toPlaintextBuffer || typeof ff.toPlaintextBuffer !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "toPlaintextBuffer" as a function`);
  }

  if (!ff.newNativeMsg || typeof ff.newNativeMsg !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "newNativeMsg" as a function`);
  }

  if (!ff.fromNativeMsg || typeof ff.fromNativeMsg !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "fromNativeMsg" as a function`);
  }

  if (
    !ff.fromDecryptedNativeMsg ||
    typeof ff.fromDecryptedNativeMsg !== 'function'
  ) {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "fromDecryptedNativeMsg" as a function`);
  }

  if (!ff.toNativeMsg || typeof ff.toNativeMsg !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "toNativeMsg" as a function`);
  }

  if (!ff.validate || typeof ff.validate !== 'function') {
    // prettier-ignore
    throw new Error(`Your feed format "${ff.name}" requires "validate" as a function`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 */
function assertEncodingsHasJS(feedFormat) {
  if (!feedFormat.encodings.includes('js')) {
    throw new Error(
      `Your feed format "${feedFormat.name}" must support JS encoding. Add 'js' to feedFormat.encodings`,
    );
  }
}

/**
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function createDummyOpts(keysFactory, extraOpts) {
  return {
    keys: keysFactory(),
    sequence: 1,
    previous: null,
    timestamp: Date.now(),
    hmacKey: null,
    content: TEST_CONTENT,
    ...extraOpts,
  };
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertIsNativeMsg(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  if (!feedFormat.isNativeMsg(nativeMsg)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" must return true for isNativeMsg() for a nativeMsg that was just created with newNativeMsg()`);
  }
  if (feedFormat.isNativeMsg(-1)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" isNativeMsg() must return false for nonsense inputs, but it seems it is returning true`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 */
function assertIsAuthor(feedFormat, keysFactory) {
  const feedId = keysFactory().id;
  if (!feedFormat.isAuthor(feedId)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" must return true for isAuthor(${feedId}), since ${feedId} was created by the factory function you provided to check()`);
  }
  if (feedFormat.isAuthor(-1)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" isAuthor() must return false for nonsense inputs, but it seems it is returning true`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertGetFeedId(feedFormat, keysFactory, extraOpts) {
  const keys = keysFactory();
  const feedId1 = keys.id;
  const opts = createDummyOpts(() => keys, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  const feedId2 = feedFormat.getFeedId(nativeMsg);
  if (typeof feedId2 !== 'string') {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" getFeedId() must return a string, but returned ${feedId2}`);
  }
  if (!Ref.isFeedId(feedId2) && !feedId2.startsWith('ssb:')) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" getFeedId() must return either a sigil ID or an SSB URI, but returned ${feedId2}`);
  }
  if (feedId2 !== feedId1) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" getFeedId() must return the correct feed ID ${feedId1}, but returned ${feedId2}`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertGetMsgId(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  const msgId = feedFormat.getMsgId(nativeMsg);
  if (typeof msgId !== 'string') {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" getMsgId() must return a string, but returned ${msgId}`);
  }
  if (!Ref.isMsgId(msgId) && !msgId.startsWith('ssb:')) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" getMsgId() must return either a sigil ID or an SSB URI, but returned ${msgId}`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertGetSequence(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  const sequence = feedFormat.getSequence(nativeMsg);
  if (sequence !== 1) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" getSequence() must return the number 1 determined by newNativeMsg() inputs, but returned ${sequence}. If the problem is not in getSequence(), perhaps it is in newNativeMsg()?`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertPlaintextBuf(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const plaintextBuf = feedFormat.toPlaintextBuffer(opts);
  if (!plaintextBuf || !Buffer.isBuffer(plaintextBuf)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" toPlaintextBuffer() must return a Buffer, but returned ${plaintextBuf}`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertFromNativeMsgToJS(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  const msgVal = feedFormat.fromNativeMsg(nativeMsg, 'js');
  if (typeof msgVal !== 'object') {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object but returned "${msgVal}" instead`);
  }
  const {author, sequence, previous, timestamp, content} = msgVal;
  if (author !== opts.keys.id) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object with msgVal.author=${opts.keys.id} but had "${author}" instead`);
  }
  if (
    typeof sequence !== 'number' ||
    sequence < 0 ||
    !Number.isInteger(sequence)
  ) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object with msgVal.sequence as a non-negative integer but had "${sequence}" instead`);
  }
  if (previous !== null && typeof previous !== 'string') {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object with msgVal.previous as null or string, but had "${previous}" instead`);
  }
  if (
    typeof previous === 'string' &&
    !Ref.isMsgId(previous) &&
    !previous.startsWith('ssb:')
  ) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object with msgVal.previous as a sigil ID or SSB URI, but had "${previous}" instead`);
  }
  if (typeof timestamp !== 'number' || timestamp <= 0) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object with msgVal.timestamp as a positive number but had "${timestamp}" instead`);
  }
  const expectedContent = extraOpts.content || TEST_CONTENT;
  if (!deepEqual(content, expectedContent)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() JS-encoding must return an object with msgVal.content as an object but had "${JSON.stringify(content)}" instead`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 */
function assertFromToInverses(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  const msgVal = feedFormat.fromNativeMsg(nativeMsg, 'js');
  const nativeMsg2 = feedFormat.toNativeMsg(msgVal, 'js');
  if (Buffer.isBuffer(nativeMsg)) {
    if (!Buffer.isBuffer(nativeMsg2)) {
      // prettier-ignore
      throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() and toNativeMsg() are not each other's inverse, because the result of toNativeMsg() is not a Buffer, but the result of newNativeMsg() is a Buffer`);
    }
    if (!nativeMsg.equals(nativeMsg2)) {
      // prettier-ignore
      throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() and toNativeMsg() are not each other's inverse, see ${nativeMsg.toString('hex')} != ${nativeMsg2.toString('hex')}`);
    }
  } else if (Buffer.isBuffer(nativeMsg2)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() and toNativeMsg() are not each other's inverse, because the result of newNativeMsg() is a Buffer, but the result of toNativeMsg() is not a Buffer`);
  } else if (!deepEqual(msgVal, nativeMsg2)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromNativeMsg() and toNativeMsg() are not each other's inverse, see ${JSON.stringify(nativeMsg)} != ${JSON.stringify(nativeMsg2)}`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 */
function assertFromDecrypted(feedFormat, keysFactory, extraOpts) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  const msgVal1 = feedFormat.fromNativeMsg(nativeMsg, 'js');
  const plaintextBuf = feedFormat.toPlaintextBuffer(opts);
  const msgVal2 = feedFormat.fromDecryptedNativeMsg(
    plaintextBuf,
    nativeMsg,
    'js',
  );
  if (!deepEqual(msgVal1, msgVal2)) {
    // prettier-ignore
    throw new Error(`Your feed format "${feedFormat.name}" fromDecryptedNativeMsg() must return ${JSON.stringify(msgVal1)} but returned ${JSON.stringify(msgVal2)}`);
  }
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 * @param {CallableFunction} cb
 */
function assertValidate(feedFormat, keysFactory, extraOpts, cb) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  feedFormat.validate(nativeMsg, null, null, cb);
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 * @param {CallableFunction} cb
 */
function assertValidateBatch(feedFormat, keysFactory, extraOpts, cb) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  feedFormat.validateBatch([nativeMsg], null, null, cb);
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 * @param {CallableFunction} cb
 */
function assertValidateOOO(feedFormat, keysFactory, extraOpts, cb) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  feedFormat.validateOOO(nativeMsg, null, cb);
}

/**
 * @param {FeedFormat} feedFormat
 * @param {CallableFunction} keysFactory
 * @param {Object} extraOpts
 * @param {CallableFunction} cb
 */
function assertValidateOOOBatch(feedFormat, keysFactory, extraOpts, cb) {
  const opts = createDummyOpts(keysFactory, extraOpts);
  const nativeMsg = feedFormat.newNativeMsg(opts);
  feedFormat.validateOOOBatch([nativeMsg], null, cb);
}

function check(feedFormat, keysFactory, ...args) {
  const extraOpts = typeof args[0] === 'function' ? {} : args[0];
  const cb = typeof args[0] === 'function' ? args[0] : args[1];
  try {
    assertHasAllRequiredProps(feedFormat);
    assertEncodingsHasJS(feedFormat);
    assertIsAuthor(feedFormat, keysFactory);
    assertIsNativeMsg(feedFormat, keysFactory, extraOpts);
    assertGetFeedId(feedFormat, keysFactory, extraOpts);
    assertGetMsgId(feedFormat, keysFactory, extraOpts);
    assertGetSequence(feedFormat, keysFactory, extraOpts);
    assertPlaintextBuf(feedFormat, keysFactory, extraOpts);
    assertFromNativeMsgToJS(feedFormat, keysFactory, extraOpts);
    assertFromToInverses(feedFormat, keysFactory, extraOpts);
    assertFromDecrypted(feedFormat, keysFactory, extraOpts);
  } catch (err) {
    cb(err);
    return;
  }

  const done = multicb();
  assertValidate(feedFormat, keysFactory, extraOpts, done());
  if (feedFormat.validateBatch) {
    assertValidateBatch(feedFormat, keysFactory, extraOpts, done());
  }
  if (feedFormat.validateOOO) {
    assertValidateOOO(feedFormat, keysFactory, extraOpts, done());
  }
  if (feedFormat.validateOOOBatch) {
    assertValidateOOOBatch(feedFormat, keysFactory, extraOpts, done());
  }

  done(cb);
}

module.exports = {
  check,
};
