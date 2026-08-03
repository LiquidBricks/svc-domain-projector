export async function projectGateResultComputed({
  rootCtx: { dataMapper },
  scope: {
    stateEdgeId,
    result,
    resultValue,
    status,
    updatedAt,
  },
}) {
  const projectedResult = typeof resultValue === 'string'
    ? resultValue
    : (result != null ? JSON.stringify(result) : '')

  await dataMapper.edge.has_gate_state.stateMachine_gateInstanceRef.updateResultStatusUpdatedAt({
    edgeId: stateEdgeId,
    result: projectedResult,
    status,
    updatedAt,
  })

  return { stateEdgeId }
}
