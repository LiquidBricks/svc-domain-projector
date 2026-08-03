import {
  DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
  PRECONDITION_INVALID,
} from '@liquid-bricks/lib-diagnostics/codes'

const canonicalIsoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key)

export function validateUpdatedAt({
  handlerDiagnostics,
  scope,
  type,
  event,
}) {
  const { updatedAt } = scope

  handlerDiagnostics.require(
    hasOwn(scope, 'updatedAt')
      && typeof updatedAt === 'string'
      && updatedAt.length > 0,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    `updatedAt required for ${type} ${event} projection`,
    { field: 'updatedAt', type },
  )

  const timestamp = Date.parse(updatedAt)
  handlerDiagnostics.require(
    canonicalIsoDateTime.test(updatedAt)
      && Number.isFinite(timestamp)
      && new Date(timestamp).toISOString() === updatedAt,
    PRECONDITION_INVALID,
    `updatedAt must be a canonical ISO date-time for ${type} ${event} projection`,
    { field: 'updatedAt', type, updatedAt },
  )

  return updatedAt
}
