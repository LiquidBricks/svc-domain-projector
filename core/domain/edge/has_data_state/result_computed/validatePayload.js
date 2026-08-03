import { DOMAIN_PROJECTOR_PRECONDITION_REQUIRED } from '@liquid-bricks/lib-diagnostics/codes'
import { validateProvidedResult } from '../../_shared/validateProvidedResult.js'
import { validateUpdatedAt } from '../../_shared/validateUpdatedAt.js'

export function validatePayload({ scope }) {
  const {
    handlerDiagnostics,
    stateEdgeId,
    status,
    stateEdgeStatus,
  } = scope

  handlerDiagnostics.require(
    typeof stateEdgeId === 'string' && stateEdgeId.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    'stateEdgeId required for data result_computed projection',
    { field: 'stateEdgeId' },
  )

  const normalizedStatus = validateProvidedResult({
    handlerDiagnostics,
    hasResult: Object.prototype.hasOwnProperty.call(scope, 'result'),
    hasError: Object.prototype.hasOwnProperty.call(scope, 'error'),
    status,
    stateEdgeStatus,
    type: 'data',
  })

  return {
    status: normalizedStatus,
    updatedAt: validateUpdatedAt({
      handlerDiagnostics,
      scope,
      type: 'data',
      event: 'result_computed',
    }),
  }
}
