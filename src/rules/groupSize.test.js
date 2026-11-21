import test from 'node:test';
import assert from 'node:assert/strict';
import { checkGroupSize, maxAllowedSize } from './groupSize.js';

test('accepts an ordinary valid group size', () => {
  const result = checkGroupSize(3, 10);
  assert.equal(result.ok, true);
  assert.equal(result.code, 'ok');
});

test('accepts exactly six hikers (the limit)', () => {
  assert.equal(checkGroupSize(6, 10).ok, true);
});

test('rejects seven hikers (above the limit)', () => {
  const result = checkGroupSize(7, 10);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'above-max');
});

test('rejects zero, fractions and empty input', () => {
  assert.equal(checkGroupSize(0, 10).code, 'below-min');
  assert.equal(checkGroupSize(2.5, 10).code, 'not-integer');
  assert.equal(checkGroupSize(NaN, 10).code, 'not-integer');
});

test('never allows more hikers than seats left', () => {
  assert.equal(checkGroupSize(3, 3).ok, true); // exactly the seats left
  assert.equal(checkGroupSize(4, 3).code, 'not-enough-seats');
  assert.equal(checkGroupSize(1, 0).code, 'sold-out');
});

test('maxAllowedSize is capped by both the limit and seats left', () => {
  assert.equal(maxAllowedSize(12), 6);
  assert.equal(maxAllowedSize(2), 2);
  assert.equal(maxAllowedSize(0), 0);
});