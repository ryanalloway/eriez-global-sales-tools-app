/** Public display-unit and extrapolation checks, independent of the API repository. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {forceUnits, makeUnits} from '../src/lib/units.ts';
import {isExtrapolatedLift, measuredDistanceRange} from '../src/lib/accuracy.ts';

test('convert distance and force index using exact engineering units', () => {
  assert.ok(Math.abs(makeUnits('inch', 'T²/m').factor * 25.4 - 1) < 1e-8);
  assert.equal(makeUnits('mm', 'G²/mm').factor, 1);
  assert.deepEqual(forceUnits, {
    'T²/m': 1,
    'G²/mm': 100000,
    'G²/cm': 1000000,
    '10³ G²/cm': 1000,
    'G²/inch': 2540000,
  });
});

test('flag lift distances outside the measured range', () => {
  const profile = {inputDistance: [0, 100, 200, 300]};
  assert.deepEqual(measuredDistanceRange(profile), {min: 0, max: 300});
  assert.equal(isExtrapolatedLift(profile, 170), false);
  assert.equal(isExtrapolatedLift(profile, 300), false);
  assert.equal(isExtrapolatedLift(profile, 330), true);
  assert.equal(isExtrapolatedLift(profile, 360), true);
  assert.equal(isExtrapolatedLift(profile, null), false);
  assert.equal(isExtrapolatedLift({inputDistance: [25, 100, 300]}, 10), true);
  assert.equal(isExtrapolatedLift({inputDistance: [25, 100, 300]}, 25), false);
  assert.equal(isExtrapolatedLift({}, 1000), false);
});
