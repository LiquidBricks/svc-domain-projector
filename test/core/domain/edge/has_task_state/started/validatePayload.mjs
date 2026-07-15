import test from 'node:test'
import assert from 'node:assert/strict'

import { diagnostics as makeDiagnostics } from '@liquid-bricks/lib-diagnostics'

import { validatePayload } from '../../../../../../core/domain/edge/has_task_state/started/validatePayload.js'

const noop = () => {}

function makeDiagnosticsInstance() {
  return makeDiagnostics({
    logger: { info: noop, warn: noop, error: noop, debug: noop },
    metrics: { timing: noop, count: noop },
    sample: () => true,
    rateLimit: () => true,
  })
}

test('validatePayload preserves the required fact timestamp', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()
  const updatedAt = '2026-07-14T12:34:56.000Z'

  assert.deepEqual(
    validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'task-state-edge-1',
        updatedAt,
      },
    }),
    { updatedAt },
  )
})

test('validatePayload rejects a missing task stateEdgeId', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: '',
        updatedAt: '2026-07-14T12:34:56.000Z',
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('validatePayload rejects a missing task started updatedAt', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'task-state-edge-1',
        updatedAt: '',
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})
