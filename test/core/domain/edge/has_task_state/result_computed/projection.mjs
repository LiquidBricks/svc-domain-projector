import test from 'node:test'
import assert from 'node:assert/strict'

import { spec } from '../../../../../../core/domain/edge/has_task_state/result_computed/index.js'

function makeDataMapper(calls) {
  return {
    edge: {
      has_task_state: {
        stateMachine_task: {
          async updateResultStatusUpdatedAt(payload) {
            calls.push(payload)
          },
        },
      },
    },
  }
}

test('task result projection writes a provided result', async () => {
  const calls = []
  const rootCtx = { dataMapper: makeDataMapper(calls) }

  await spec.handler({
    rootCtx,
    scope: {
      stateEdgeId: 'task-state-edge-1',
      result: { value: 42 },
      status: 'provided',
      updatedAt: '2026-08-02T12:00:00.000Z',
    },
  })
  assert.deepEqual(calls, [{
    edgeId: 'task-state-edge-1',
    result: '{"value":42}',
    status: 'provided',
    updatedAt: '2026-08-02T12:00:00.000Z',
  }])
})
