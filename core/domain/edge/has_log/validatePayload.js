import {
  DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
  PRECONDITION_INVALID,
} from '@liquid-bricks/lib-diagnostics/codes'
import { validateUpdatedAt } from '../_shared/validateUpdatedAt.js'

const functionTypes = new Set(['data', 'gate', 'task'])

export function validatePayload({ scope }) {
  const {
    handlerDiagnostics,
    subjectParams,
    instanceId,
    logId,
    name,
    type,
    method,
    args,
  } = scope

  for (const [field, value] of [
    ['instanceId', instanceId],
    ['logId', logId],
    ['name', name],
    ['method', method],
  ]) {
    handlerDiagnostics.require(
      typeof value === 'string' && value.length > 0,
      DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
      `${field} required for has_log projection`,
      { field },
    )
  }

  handlerDiagnostics.require(
    functionTypes.has(type),
    PRECONDITION_INVALID,
    'type must be data, gate, or task for has_log projection',
    { field: 'type', type },
  )
  handlerDiagnostics.require(
    Array.isArray(args),
    PRECONDITION_INVALID,
    'args must be an array for has_log projection',
    { field: 'args' },
  )
  handlerDiagnostics.require(
    subjectParams?.action === method,
    PRECONDITION_INVALID,
    'has_log method must match the fact path',
    { field: 'method', method, action: subjectParams?.action },
  )
  handlerDiagnostics.require(
    subjectParams?.id === instanceId,
    PRECONDITION_INVALID,
    'has_log instanceId must match the fact path',
    { field: 'instanceId', instanceId, id: subjectParams?.id },
  )

  return {
    updatedAt: validateUpdatedAt({
      handlerDiagnostics,
      scope,
      type: 'has_log',
      event: method,
    }),
  }
}
