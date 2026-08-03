import test from 'node:test'
import assert from 'node:assert/strict'

import { spec as dataSpec } from '../../../../../core/domain/edge/has_data_state/computation_failed/index.js'
import { spec as gateSpec } from '../../../../../core/domain/edge/has_gate_state/computation_failed/index.js'
import { spec as taskSpec } from '../../../../../core/domain/edge/has_task_state/computation_failed/index.js'

function makeDataMapper(calls) {
  const update = type => async payload => calls.push({ type, payload })
  return {
    edge: {
      has_data_state: {
        stateMachine_data: { updateStatusUpdatedAt: update('data') },
      },
      has_gate_state: {
        stateMachine_gateInstanceRef: { updateStatusUpdatedAt: update('gate') },
      },
      has_task_state: {
        stateMachine_task: { updateStatusUpdatedAt: update('task') },
      },
    },
  }
}

for (const [type, spec] of [
  ['data', dataSpec],
  ['gate', gateSpec],
  ['task', taskSpec],
]) {
  test(`${type} computation_failed projection updates status without mutating result`, async () => {
    const calls = []
    const updatedAt = '2026-08-02T12:01:00.000Z'

    const result = await spec.handler({
      rootCtx: { dataMapper: makeDataMapper(calls) },
      scope: {
        stateEdgeId: `${type}-state-edge-1`,
        status: 'error',
        updatedAt,
      },
    })

    assert.deepEqual(calls, [{
      type,
      payload: {
        edgeId: `${type}-state-edge-1`,
        status: 'error',
        updatedAt,
      },
    }])
    assert.equal(Object.hasOwn(calls[0].payload, 'result'), false)
    assert.deepEqual(result, { stateEdgeId: `${type}-state-edge-1` })
  })
}
