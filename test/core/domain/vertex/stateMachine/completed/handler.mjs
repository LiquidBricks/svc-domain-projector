import test from 'node:test'
import assert from 'node:assert/strict'

import { projectCompleted } from '../../../../../../core/domain/vertex/stateMachine/completed/handler.js'

test('projectCompleted sets the state machine complete with the fact timestamp', async () => {
  const calls = []
  const dataMapper = {
    vertex: {
      stateMachine: {
        async setComplete(payload) {
          calls.push(payload)
        },
      },
    },
  }
  const scope = {
    stateMachineId: 'state-machine-1',
    updatedAt: '2026-07-14T12:34:56.000Z',
  }

  const result = await projectCompleted({
    rootCtx: { dataMapper },
    scope,
  })

  assert.deepEqual(calls, [{
    stateMachineId: scope.stateMachineId,
    updatedAt: scope.updatedAt,
  }])
  assert.deepEqual(result, { stateMachineId: scope.stateMachineId })
})
