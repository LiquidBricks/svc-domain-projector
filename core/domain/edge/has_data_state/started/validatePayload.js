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
    'stateEdgeId required for data started projection',
    { field: 'stateEdgeId' },
  )
  handlerDiagnostics.require(
    typeof updatedAt === 'string' && updatedAt.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    'updatedAt required for data started projection',
    { field: 'updatedAt' },
  )

  return { updatedAt }
}
