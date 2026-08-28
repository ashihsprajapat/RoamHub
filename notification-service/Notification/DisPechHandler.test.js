import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveHandler } from './DisPechHandler.js';
import { notificationTypes } from './Event/notificationTypes.js';
import { OtpHandler } from './handler/otpHandler.js';
import { wellComeHandler } from './handler/welcomeHandler.js';

test('resolveHandler returns the matching handler for a notification type', () => {
    const handler = resolveHandler(notificationTypes.SEND_OTP);
    assert.equal(handler, OtpHandler);
});

test('resolveHandler accepts an event object and reads its type field', () => {
    const handler = resolveHandler({ type: notificationTypes.WELCOME_EMAIL });
    assert.equal(handler, wellComeHandler)
});