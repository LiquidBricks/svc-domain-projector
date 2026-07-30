import { DOMAIN_PROJECTOR_PRECONDITION_REQUIRED } from '@liquid-bricks/lib-diagnostics/codes'

export function validatePayload({
  scope: {
    handlerDiagnostics,
    stateEdgeId,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof stateEdgeId === 'string' && stateEdgeId.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    'stateEdgeId required for gate state result_computed projection',
    { field: 'stateEdgeId' },
  )

  return {
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
