import test from 'node:test';
import assert from 'node:assert/strict';
import {traceIsoline,LIFT_THRESHOLDS} from '../src/components/charts/forceContours.ts';

test('all six lift contours preserve original Python reference thresholds',()=>{
  assert.deepEqual(LIFT_THRESHOLDS,[
    ['Sphere',0.033232],['Cube',0.025795],['Nut',0.016268],
    ['Bar 4:1',0.006],['Bar 6:1',0.003969],['Bar 10:1',0.00251],
  ]);
});

test('isoline interpolation produces separated, finite contour segments',()=>{
  const line=traceIsoline([0,5,10],[0,5,10],[[0,2,4],[0,2,4],[0,2,4]],2.5);
  assert.equal(line.segmentCount,2);
  assert.deepEqual(line.x,[6.25,6.25,null,6.25,6.25,null]);
  assert.deepEqual(line.y,[0,5,null,5,10,null]);
});

test('isoline handles absent threshold and incomplete data',()=>{
  const none=traceIsoline([0,5],[0,5],[[10,10],[10,10]],2);
  assert.equal(none.segmentCount,0);
  assert.throws(()=>traceIsoline([0,5],[0,5],[[1,2]],1),/dimensions/);
});

import {FORCE_FILL_LEVELS,FORCE_FILL_COLORS,forceFillScale,pickIsolineLabel} from '../src/components/charts/forceContours.ts';

test('force fill has only the seven original Python engineering bands',()=>{
  assert.deepEqual(FORCE_FILL_LEVELS,[0,0.00251,0.003969,0.006,0.016268,0.025795,0.033232]);
  assert.equal(FORCE_FILL_COLORS.length,7);
  const stops=forceFillScale();
  assert.equal(stops.length,14);
  assert.deepEqual(stops[0],[0,'#ffefe8']);
  assert.deepEqual(stops.at(-1),[1,'#67000d']);
  for(let i=1;i<7;i++){
    assert.equal(stops[2*i-1][0],stops[2*i][0],`Engineering boundary ${i} must be exact`);
    assert.ok(Math.abs(stops[2*i][0]*0.034232-FORCE_FILL_LEVELS[i])<1e-12);
  }
});

test('isoline object labels lie on present traces only',()=>{
  const line=traceIsoline([0,5,10],[0,5,10],[[0,2,4],[0,2,4],[0,2,4]],2.5);
  const place=pickIsolineLabel(line,[0,10],[0,10],0.65);
  assert.ok(place);
  assert.equal(place.x,6.25);
  assert.equal(pickIsolineLabel({x:[],y:[],segmentCount:0},[0,10],[0,10],0.5),null);
});
