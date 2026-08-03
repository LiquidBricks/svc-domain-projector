import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

async function projectComputationFailed({
  rootCtx: { dataMapper },
  scope: { stateEdgeId, status, updatedAt },
}) {
  await dataMapper.edge.has_gate_state.stateMachine_gateInstanceRef.updateStatusUpdatedAt({
    edgeId: stateEdgeId,
    status,
    updatedAt,
  })

  return { stateEdgeId }
}

export { path }

export const spec = {
  decode: [
    decodeData([
      'stateEdgeId',
      'stateId',
      'result',
      'resultValue',
      'status',
      'stateEdgeStatus',
      'error',
      'updatedAt',
    ]),
  ],
  pre: [
    validatePayload,
  ],
  handler: projectComputationFailed,
  post: [
    ackMessage,
  ],
}
