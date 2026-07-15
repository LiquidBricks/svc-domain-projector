import test from 'node:test'
import assert from 'node:assert/strict'

import { spec } from '../../../../../../core/domain/vertex/gateInstanceRef/result_computed/index.js'

test('vertex gate projection mutates the gate ref and acknowledges', async () => {
  const calls = []
  const dataMapper = {
    vertex: {
      gateInstanceRef: {
        async setResultAndUpdatedAt(payload) {
          calls.push(payload)
        },
      },
    },
  }
  const scope = {
    gateInstanceRefId: 'gate-instance-ref-1',
    result: { passed: true },
    updatedAt: '2026-07-14T12:34:56.000Z',
  }
  let acknowledged = false
  const message = {
    ack() {
      acknowledged = true
    },
  }

  const result = await spec.handler({
    rootCtx: { dataMapper },
    scope,
  })
  spec.post[0]({ message })

  assert.deepEqual(calls, [{
    gateInstanceRefId: scope.gateInstanceRefId,
    result: JSON.stringify(scope.result),
    updatedAt: scope.updatedAt,
  }])
  assert.deepEqual(result, { gateInstanceRefId: scope.gateInstanceRefId })
  assert.equal(acknowledged, true)
})

test('vertex gate projection preserves a serialized resultValue', async () => {
  const calls = []
  const resultValue = '{"passed":false}'
  const dataMapper = {
    vertex: {
      gateInstanceRef: {
        async setResultAndUpdatedAt(payload) {
          calls.push(payload)
        },
      },
    },
  }

  await spec.handler({
    rootCtx: { dataMapper },
    scope: {
      gateInstanceRefId: 'gate-instance-ref-1',
      result: { passed: true },
      resultValue,
      updatedAt: '2026-07-14T12:34:56.000Z',
    },
  })

  assert.equal(calls[0].result, resultValue)
})
