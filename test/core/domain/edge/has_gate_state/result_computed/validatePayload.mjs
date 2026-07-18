import test from 'node:test'
import assert from 'node:assert/strict'

import { diagnostics as makeDiagnostics } from '@liquid-bricks/lib-diagnostics'

import { validatePayload } from '../../../../../../core/domain/edge/has_gate_state/result_computed/validatePayload.js'

const noop = () => {}

function makeDiagnosticsInstance() {
  return makeDiagnostics({
    logger: { info: noop, warn: noop, error: noop, debug: noop },
    metrics: { timing: noop, count: noop },
    sample: () => true,
    rateLimit: () => true,
  })
}

test('gate validation preserves a supplied updatedAt', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()
  const updatedAt = '2026-07-14T12:34:56.000Z'

  assert.deepEqual(
    validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        updatedAt,
      },
    }),
    { updatedAt },
  )
})

test('gate validation defaults updatedAt', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()
  const before = Date.now()

  const result = validatePayload({
    scope: {
      handlerDiagnostics,
      stateEdgeId: 'gate-state-edge-1',
    },
  })

  const timestamp = Date.parse(result.updatedAt)
  assert.ok(Number.isFinite(timestamp))
  assert.ok(timestamp >= before)
  assert.ok(timestamp <= Date.now())
})

test('gate validation rejects a missing stateEdgeId', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: '',
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})
