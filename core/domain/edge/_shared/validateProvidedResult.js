import {
  DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
  PRECONDITION_INVALID,
} from '@liquid-bricks/lib-diagnostics/codes'

export function validateProvidedResult({
  handlerDiagnostics,
  hasResult,
  hasError,
  status,
  stateEdgeStatus,
  type,
}) {
  handlerDiagnostics.require(
    typeof status === 'string' && status.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `status required for ${type} result_computed projection`,
    { field: 'status', type },
  )
  handlerDiagnostics.require(
    typeof stateEdgeStatus === 'string' && stateEdgeStatus.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `stateEdgeStatus required for ${type} result_computed projection`,
    { field: 'stateEdgeStatus', type },
  )
  handlerDiagnostics.require(
    status === 'provided' && stateEdgeStatus === 'provided',
    PRECONDITION_INVALID,
    `status and stateEdgeStatus must be provided for ${type} result_computed projection`,
    { field: 'status', type, status, stateEdgeStatus },
  )
  handlerDiagnostics.require(
    hasResult,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `native result required for ${type} result_computed projection`,
    { field: 'result', type },
  )
  handlerDiagnostics.require(
    !hasError,
    PRECONDITION_INVALID,
    `error must be absent for ${type} result_computed projection`,
    { field: 'error', type },
  )

  return 'provided'
}
