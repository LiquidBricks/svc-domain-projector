import test from 'node:test'
import assert from 'node:assert/strict'

import { diagnostics as makeDiagnostics } from '@liquid-bricks/lib-diagnostics'

import { validatePayload as validateData } from '../../../../../core/domain/edge/has_data_state/computation_failed/validatePayload.js'
import { validatePayload as validateGate } from '../../../../../core/domain/edge/has_gate_state/computation_failed/validatePayload.js'
import { validatePayload as validateTask } from '../../../../../core/domain/edge/has_task_state/computation_failed/validatePayload.js'

const noop = () => {}

function diagnostics() {
  return makeDiagnostics({
    logger: { info: noop, warn: noop, error: noop, debug: noop },
    metrics: { timing: noop, count: noop },
    sample: () => true,
    rateLimit: () => true,
  })
}

const validators = [
  ['data', validateData],
  ['gate', validateGate],
  ['task', validateTask],
]

const validError = { name: 'Error', message: 'computation failed', code: 'COMPUTE_FAILED' }
const updatedAt = '2026-08-02T12:01:00.000Z'

for (const [type, validatePayload] of validators) {
  const validate = payload => validatePayload({
    scope: {
      handlerDiagnostics: diagnostics(),
      stateEdgeId: `${type}-state-edge-1`,
      updatedAt,
      ...payload,
    },
  })

  test(`${type} computation_failed validation accepts a result-free structured error`, () => {
    assert.deepEqual(validate({
      status: 'error',
      stateEdgeStatus: 'error',
      error: validError,
    }), {
      status: 'error',
      updatedAt,
    })
  })

  for (const [description, payload] of [
    ['missing state edge', { stateEdgeId: '', status: 'error', stateEdgeStatus: 'error', error: validError }],
    ['missing status', { stateEdgeStatus: 'error', error: validError }],
    ['missing stateEdgeStatus', { status: 'error', error: validError }],
    ['provided status', { status: 'provided', stateEdgeStatus: 'provided', error: validError }],
    ['mismatched status', { status: 'error', stateEdgeStatus: 'provided', error: validError }],
    ['missing error', { status: 'error', stateEdgeStatus: 'error' }],
    ['empty updatedAt', { status: 'error', stateEdgeStatus: 'error', error: validError, updatedAt: '' }],
    ['non-canonical updatedAt', { status: 'error', stateEdgeStatus: 'error', error: validError, updatedAt: '2026-08-02T12:01:00Z' }],
    ['invalid updatedAt', { status: 'error', stateEdgeStatus: 'error', error: validError, updatedAt: 'not-a-date' }],
    ['native result', { status: 'error', stateEdgeStatus: 'error', error: validError, result: null }],
    ['serialized result', { status: 'error', stateEdgeStatus: 'error', error: validError, resultValue: '' }],
    ['non-object error', { status: 'error', stateEdgeStatus: 'error', error: 'failed' }],
    ['nameless error', { status: 'error', stateEdgeStatus: 'error', error: { message: 'failed' } }],
    ['message-less error', { status: 'error', stateEdgeStatus: 'error', error: { name: 'Error' } }],
    ['invalid error code', { status: 'error', stateEdgeStatus: 'error', error: { name: 'Error', message: 'failed', code: {} } }],
  ]) {
    test(`${type} computation_failed validation rejects ${description}`, () => {
      assert.throws(() => validate(payload), diagnostics().DiagnosticError)
    })
  }
}
