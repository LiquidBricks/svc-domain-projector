import { DOMAIN_PROJECTOR_PRECONDITION_REQUIRED } from '@liquid-bricks/lib-diagnostics/codes'

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
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    'stateEdgeId required for task result_computed projection',
    { field: 'stateEdgeId' },
  )

  const normalizedStatus = stateEdgeStatus ?? status
  handlerDiagnostics.require(
    typeof normalizedStatus === 'string' && normalizedStatus.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    'status required for task result_computed projection',
    { field: 'status' },
  )

  return {
    status: normalizedStatus,
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
