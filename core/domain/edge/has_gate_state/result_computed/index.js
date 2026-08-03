import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { projectGateResultComputed } from './handler.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

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
  handler: projectGateResultComputed,
  post: [
    ackMessage,
  ],
}
