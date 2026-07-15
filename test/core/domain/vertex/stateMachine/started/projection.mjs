import test from 'node:test'
import assert from 'node:assert/strict'

import { spec } from '../../../../../../core/domain/vertex/stateMachine/started/index.js'

test('state machine started projection marks it running with the fact timestamp and acknowledges', async () => {
  const calls = []
  const dataMapper = {
    vertex: {
      stateMachine: {
        async setRunning(payload) {
          calls.push(payload)
        },
      },
    },
  }
  const scope = {
    stateMachineId: 'state-machine-1',
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
    stateMachineId: scope.stateMachineId,
    updatedAt: scope.updatedAt,
  }])
  assert.deepEqual(result, { stateMachineId: scope.stateMachineId })
  assert.equal(acknowledged, true)
})
