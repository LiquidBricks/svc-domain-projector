import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { projectStarted } from './handler.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

export { path }

export const spec = {
  decode: [
    decodeData([
      'stateEdgeId',
      'updatedAt',
    ]),
  ],
  pre: [
    validatePayload,
  ],
  handler: projectStarted,
  post: [
    ackMessage,
  ],
}
