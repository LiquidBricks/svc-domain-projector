import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { projectCompleted } from './handler.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

export { path }

export const spec = {
  decode: [
    decodeData([
      'stateMachineId',
      'updatedAt',
    ]),
  ],
  pre: [
    validatePayload,
  ],
  handler: projectCompleted,
  post: [
    ackMessage,
  ],
}
