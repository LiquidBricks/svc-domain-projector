export async function projectStarted({
  rootCtx: { dataMapper },
  scope: {
    stateEdgeId,
    updatedAt,
  },
}) {
  await dataMapper.edge.has_data_state.stateMachine_data.setRunning({
    edgeId: stateEdgeId,
    updatedAt,
  })

  return { stateEdgeId }
}
