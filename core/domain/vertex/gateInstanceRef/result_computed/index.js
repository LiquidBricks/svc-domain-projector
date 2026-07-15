import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { projectGateResultComputed } from '../../../_helper/gateResultComputed.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

export { path }

export const spec = {
  decode: [
    decodeData([
      'gateInstanceRefId',
      'result',
      'resultValue',
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
