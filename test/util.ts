import assert from 'node:assert'

export function assertAlmostEqual (x, y, precision) {
  assert.strictEqual(x.toPrecision(precision), y.toPrecision(precision))
}