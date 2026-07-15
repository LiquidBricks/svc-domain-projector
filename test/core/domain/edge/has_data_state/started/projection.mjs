import test from 'node:test'
import assert from 'node:assert/strict'

import { spec } from '../../../../../../core/domain/edge/has_data_state/started/index.js'

test('data started projection marks the edge running with the fact timestamp and acknowledges', async () => {
  const calls = []
  const dataMapper = {
    edge: {
      has_data_state: {
        stateMachine_data: {
          async setRunning(payload) {
            calls.push(payload)
          },
        },
      },
    },
  }
  const scope = {
    stateEdgeId: 'data-state-edge-1',
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
    edgeId: scope.stateEdgeId,
    updatedAt: scope.updatedAt,
  }])
  assert.deepEqual(result, { stateEdgeId: scope.stateEdgeId })
  assert.equal(acknowledged, true)
})
