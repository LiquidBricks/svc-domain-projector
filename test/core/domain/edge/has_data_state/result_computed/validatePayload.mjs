import test from 'node:test'
import assert from 'node:assert/strict'

import { diagnostics as makeDiagnostics } from '@liquid-bricks/lib-diagnostics'

import { validatePayload } from '../../../../../../core/domain/edge/has_data_state/result_computed/validatePayload.js'

const noop = () => {}

function makeDiagnosticsInstance() {
  return makeDiagnostics({
    logger: { info: noop, warn: noop, error: noop, debug: noop },
    metrics: { timing: noop, count: noop },
    sample: () => true,
    rateLimit: () => true,
  })
}

function validate(payload) {
  return validatePayload({
    scope: {
      handlerDiagnostics: makeDiagnosticsInstance(),
      stateEdgeId: 'data-state-edge-1',
      updatedAt: '2026-07-14T12:34:56.000Z',
      ...payload,
    },
  })
}

test('data result validation accepts matching provided statuses', () => {
  assert.equal(validate({
    result: { value: 42 },
    status: 'provided',
    stateEdgeStatus: 'provided',
  }).status, 'provided')
})

test('data validation rejects conflicting status fields', () => {
  assert.throws(
    () => validate({ result: true, status: 'provided', stateEdgeStatus: 'error' }),
    makeDiagnosticsInstance().DiagnosticError,
  )
})

test('data validation rejects missing and unsupported statuses', () => {
  assert.throws(() => validate({ result: true }), makeDiagnosticsInstance().DiagnosticError)
  assert.throws(
    () => validate({ result: true, status: 'provided' }),
    makeDiagnosticsInstance().DiagnosticError,
  )
  assert.throws(
    () => validate({ result: true, stateEdgeStatus: 'provided' }),
    makeDiagnosticsInstance().DiagnosticError,
  )
  assert.throws(
    () => validate({ result: true, status: 'running', stateEdgeStatus: 'running' }),
    makeDiagnosticsInstance().DiagnosticError,
  )
})

test('data result validation requires a result and rejects failure payloads', () => {
  assert.throws(
    () => validate({ status: 'provided', stateEdgeStatus: 'provided' }),
    makeDiagnosticsInstance().DiagnosticError,
  )
  assert.throws(
    () => validate({
      status: 'error',
      stateEdgeStatus: 'error',
      error: { name: 'Error', message: 'failed' },
    }),
    makeDiagnosticsInstance().DiagnosticError,
  )
  assert.throws(
    () => validate({
      result: true,
      status: 'provided',
      stateEdgeStatus: 'provided',
      error: { name: 'Error', message: 'failed' },
    }),
    makeDiagnosticsInstance().DiagnosticError,
  )
})
