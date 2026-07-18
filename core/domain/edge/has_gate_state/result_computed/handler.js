export async function projectGateResultComputed({
  rootCtx: { dataMapper },
  scope: {
    stateEdgeId,
    result,
    resultValue,
    updatedAt,
  },
}) {
  const projectedResult = typeof resultValue === 'string'
    ? resultValue
    : (result != null ? JSON.stringify(result) : '')

  await dataMapper.edge.has_gate_state.stateMachine_gateInstanceRef.setResultAndUpdatedAt({
    edgeId: stateEdgeId,
    result: projectedResult,
    updatedAt,
  })

  return { stateEdgeId }
}
