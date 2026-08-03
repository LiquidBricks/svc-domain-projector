import test from 'node:test'
import assert from 'node:assert/strict'

import { diagnostics as makeDiagnostics } from '@liquid-bricks/lib-diagnostics'

import { validatePayload } from '../../../../../../core/domain/edge/has_gate_state/result_computed/validatePayload.js'

const noop = () => {}
const updatedAt = '2026-07-14T12:34:56.000Z'

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

  assert.deepEqual(
    validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        result: true,
        status: 'provided',
        stateEdgeStatus: 'provided',
        updatedAt,
      },
    }),
    { status: 'provided', updatedAt },
  )
})

test('gate result validation requires an own canonical updatedAt', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()
  const base = {
    handlerDiagnostics,
    stateEdgeId: 'gate-state-edge-1',
    result: true,
    status: 'provided',
    stateEdgeStatus: 'provided',
  }

  for (const scope of [
    base,
    { ...base, updatedAt: '' },
    { ...base, updatedAt: '2026-07-14T12:34:56Z' },
    { ...base, updatedAt: '2026-02-30T12:34:56.000Z' },
    Object.assign(Object.create({ updatedAt }), base),
  ]) {
    assert.throws(
      () => validatePayload({ scope }),
      handlerDiagnostics.DiagnosticError,
    )
  }
})

test('gate validation rejects a missing stateEdgeId', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: '',
        result: true,
        status: 'provided',
        stateEdgeStatus: 'provided',
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('gate validation rejects either missing status field', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        result: true,
        status: 'provided',
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        result: true,
        stateEdgeStatus: 'provided',
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('gate result validation rejects failure status fields', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        status: 'error',
        stateEdgeStatus: 'error',
        error: { name: 'Error', message: 'gate failed', code: 'E_GATE' },
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('gate validation rejects conflicting status fields', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        result: true,
        status: 'provided',
        stateEdgeStatus: 'error',
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('gate validation rejects an unsupported status', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        result: true,
        status: 'waiting',
        stateEdgeStatus: 'waiting',
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})

test('gate result validation requires a result and rejects error metadata', () => {
  const handlerDiagnostics = makeDiagnosticsInstance()

  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        status: 'provided',
        stateEdgeStatus: 'provided',
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
  assert.throws(
    () => validatePayload({
      scope: {
        handlerDiagnostics,
        stateEdgeId: 'gate-state-edge-1',
        result: true,
        status: 'provided',
        stateEdgeStatus: 'provided',
        error: { name: 'Error', message: 'gate failed' },
        updatedAt,
      },
    }),
    handlerDiagnostics.DiagnosticError,
  )
})
