import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

async function projectResultComputed({
  rootCtx: { dataMapper },
  scope: {
    stateEdgeId,
    result,
    resultValue,
    status,
    updatedAt,
  },
}) {
  const projectedResult = typeof resultValue === 'string'
    ? resultValue
    : (result != null ? JSON.stringify(result) : '')

  await dataMapper.edge.has_task_state.stateMachine_task.updateResultStatusUpdatedAt({
    edgeId: stateEdgeId,
    result: projectedResult,
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
      'result',
      'resultValue',
      'status',
      'stateEdgeStatus',
      'updatedAt',
    ]),
  ],
  pre: [
    validatePayload,
  ],
  handler: projectResultComputed,
  post: [
    ackMessage,
  ],
}
