import { Errors } from '../../../../../errors.js'

export function validatePayload({
  scope: {
    handlerDiagnostics,
    stateEdgeId,
    status,
    stateEdgeStatus,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof stateEdgeId === 'string' && stateEdgeId.length,
    Errors.PRECONDITION_REQUIRED,
    'stateEdgeId required for task result_computed projection',
    { field: 'stateEdgeId' },
  )

  const normalizedStatus = stateEdgeStatus ?? status
  handlerDiagnostics.require(
    typeof normalizedStatus === 'string' && normalizedStatus.length,
    Errors.PRECONDITION_REQUIRED,
    'status required for task result_computed projection',
    { field: 'status' },
  )

  return {
    status: normalizedStatus,
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
