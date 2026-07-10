import { ackMessage, decodeData } from '../../../../../middleware/index.js'
import { path } from './subject.js'
import { validatePayload } from './validatePayload.js'

async function projectResultComputed({
  rootCtx: { dataMapper },
  scope: {
    gateInstanceRefId,
    result,
    resultValue,
    updatedAt,
  },
}) {
  const projectedResult = typeof resultValue === 'string'
    ? resultValue
    : (result != null ? JSON.stringify(result) : '')

  await dataMapper.vertex.gateInstanceRef.setResultAndUpdatedAt({
    gateInstanceRefId,
    result: projectedResult,
    updatedAt,
  })

  return { gateInstanceRefId }
}

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
  handler: projectResultComputed,
  post: [
    ackMessage,
  ],
}
