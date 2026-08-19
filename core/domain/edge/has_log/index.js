import { ackMessage, decodeData } from '../../../../middleware/index.js'
import { projectLog } from './handler.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

export { path }

export const spec = {
  decode: [
    decodeData([
      'instanceId',
      'logId',
      'name',
      'type',
      'method',
      'args',
      'updatedAt',
    ]),
  ],
  pre: [
    validatePayload,
  ],
  handler: projectLog,
  post: [
    ackMessage,
  ],
}

export { projectLog, validatePayload }
