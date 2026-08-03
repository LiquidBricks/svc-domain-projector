import { validateComputationFailure } from '../../_shared/validateComputationFailure.js'

export function validatePayload(args) {
  return validateComputationFailure(args, { type: 'data' })
}
