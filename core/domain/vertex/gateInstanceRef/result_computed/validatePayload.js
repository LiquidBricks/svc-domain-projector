import { Errors } from '../../../../../errors.js'

export function validatePayload({
  scope: {
    handlerDiagnostics,
    gateInstanceRefId,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof gateInstanceRefId === 'string' && gateInstanceRefId.length,
    Errors.PRECONDITION_REQUIRED,
    'gateInstanceRefId required for gate result_computed projection',
    { field: 'gateInstanceRefId' },
  )

  return {
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
