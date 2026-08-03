import {
  DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
  PRECONDITION_INVALID,
} from '@liquid-bricks/lib-diagnostics/codes'
import { validateUpdatedAt } from './validateUpdatedAt.js'

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

function isStructuredError(error) {
  return error != null
    && typeof error === 'object'
    && !Array.isArray(error)
    && typeof error.name === 'string'
    && error.name.length > 0
    && typeof error.message === 'string'
    && (!hasOwn(error, 'code') || typeof error.code === 'string' || typeof error.code === 'number')
}

export function validateComputationFailure({ scope }, { type }) {
  const {
    handlerDiagnostics,
    stateEdgeId,
    status,
    stateEdgeStatus,
    error,
  } = scope

  handlerDiagnostics.require(
    typeof stateEdgeId === 'string' && stateEdgeId.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `stateEdgeId required for ${type} computation_failed projection`,
    { field: 'stateEdgeId', type },
  )
  handlerDiagnostics.require(
    status !== undefined,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `status required for ${type} computation_failed projection`,
    { field: 'status', type },
  )
  handlerDiagnostics.require(
    stateEdgeStatus !== undefined,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `stateEdgeStatus required for ${type} computation_failed projection`,
    { field: 'stateEdgeStatus', type },
  )
  handlerDiagnostics.require(
    status === 'error' && stateEdgeStatus === 'error',
    PRECONDITION_INVALID,
    `status and stateEdgeStatus must be error for ${type} computation_failed projection`,
    { field: 'status', type, status, stateEdgeStatus },
  )
  handlerDiagnostics.require(
    !hasOwn(scope, 'result'),
    PRECONDITION_INVALID,
    `result must be absent for ${type} computation_failed projection`,
    { field: 'result', type },
  )
  handlerDiagnostics.require(
    !hasOwn(scope, 'resultValue'),
    PRECONDITION_INVALID,
    `resultValue must be absent for ${type} computation_failed projection`,
    { field: 'resultValue', type },
  )
  handlerDiagnostics.require(
    isStructuredError(error),
    PRECONDITION_INVALID,
    `structured error required for ${type} computation_failed projection`,
    { field: 'error', type, error },
  )

  return {
    status: 'error',
    updatedAt: validateUpdatedAt({
      handlerDiagnostics,
      scope,
      type,
      event: 'computation_failed',
    }),
  }
}
