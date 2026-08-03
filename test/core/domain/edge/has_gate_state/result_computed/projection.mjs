import test from 'node:test'
import assert from 'node:assert/strict'

import { spec } from '../../../../../../core/domain/edge/has_gate_state/result_computed/index.js'

function makeDataMapper(calls) {
  return {
    edge: {
      has_gate_state: {
        stateMachine_gateInstanceRef: {
          async updateResultStatusUpdatedAt(payload) {
            calls.push(payload)
          },
        },
      },
    },
  }
}

test('gate-state edge projection mutates the edge and acknowledges', async () => {
  const calls = []
  const scope = {
    stateEdgeId: 'gate-state-edge-1',
    result: { passed: true },
    status: 'provided',
    updatedAt: '2026-07-14T12:34:56.000Z',
  }
  let acknowledged = false
  const message = {
    ack() {
      acknowledged = true
    },
  }

  const result = await spec.handler({
    rootCtx: { dataMapper: makeDataMapper(calls) },
    scope,
  })
  spec.post[0]({ message })

  assert.deepEqual(calls, [{
    edgeId: scope.stateEdgeId,
    result: JSON.stringify(scope.result),
    status: scope.status,
    updatedAt: scope.updatedAt,
  }])
  assert.deepEqual(result, { stateEdgeId: scope.stateEdgeId })
  assert.equal(acknowledged, true)
})

test('gate-state result projection preserves a serialized resultValue', async () => {
  const calls = []
  const resultValue = '{"passed":false}'

  await spec.handler({
    rootCtx: { dataMapper: makeDataMapper(calls) },
    scope: {
      stateEdgeId: 'gate-state-edge-1',
      result: { passed: true },
      resultValue,
      status: 'provided',
      updatedAt: '2026-07-14T12:34:56.000Z',
    },
  })

  assert.equal(calls[0].result, resultValue)
})
