import test from 'node:test'
import assert from 'node:assert/strict'

import { diagnostics as makeDiagnostics } from '@liquid-bricks/lib-diagnostics'

import { validatePayload } from '../../../../../../core/domain/vertex/stateMachine/started/validatePayload.js'

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
        stateMachineId: 'state-machine-1',
        updatedAt,
      },
    }),
    { updatedAt },
  )
})

test('validatePayload rejects a missing stateMachineId', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateMachineId: '',
        updatedAt: '2026-07-14T12:34:56.000Z',
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('validatePayload rejects a missing state machine started updatedAt', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateMachineId: 'state-machine-1',
        updatedAt: '',
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})
