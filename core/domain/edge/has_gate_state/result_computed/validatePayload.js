import { Errors } from '../../../../../errors.js'

export function validatePayload({
  scope: {
    handlerDiagnostics,
    stateEdgeId,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof stateEdgeId === 'string' && stateEdgeId.length,
    Errors.PRECONDITION_REQUIRED,
    'stateEdgeId required for gate state result_computed projection',
    { field: 'stateEdgeId' },
  )

  return {
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
