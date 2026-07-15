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
    'stateEdgeId required for data started projection',
    { field: 'stateEdgeId' },
  )
  handlerDiagnostics.require(
    typeof updatedAt === 'string' && updatedAt.length,
    Errors.PRECONDITION_REQUIRED,
    'updatedAt required for data started projection',
    { field: 'updatedAt' },
  )

  return { updatedAt }
}
