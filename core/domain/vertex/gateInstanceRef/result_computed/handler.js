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
