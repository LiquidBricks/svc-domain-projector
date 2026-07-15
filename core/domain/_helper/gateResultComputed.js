import { Errors } from '../../../errors.js'

export async function projectGateResultComputed({
  rootCtx: { dataMapper },
  scope: {
    gateInstanceRefId,
    result,
    resultValue,
    updatedAt,
  },
}) {
  const projectedResult = typeof resultValue === 'string'
    ? resultValue
    : (result != null ? JSON.stringify(result) : '')

  await dataMapper.vertex.gateInstanceRef.setResultAndUpdatedAt({
    gateInstanceRefId,
    result: projectedResult,
    updatedAt,
  })

  return { gateInstanceRefId }
}

export function validateGateResultComputed({
  scope: {
    handlerDiagnostics,
    gateInstanceRefId,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof gateInstanceRefId === 'string' && gateInstanceRefId.length,
    Errors.PRECONDITION_REQUIRED,
    'gateInstanceRefId required for gate result_computed projection',
    { field: 'gateInstanceRefId' },
  )

  return {
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
