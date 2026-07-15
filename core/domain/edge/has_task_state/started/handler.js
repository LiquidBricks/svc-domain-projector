export async function projectStarted({
  rootCtx: { dataMapper },
  scope: {
    stateEdgeId,
    updatedAt,
  },
}) {
  await dataMapper.edge.has_task_state.stateMachine_task.setRunning({
    edgeId: stateEdgeId,
    updatedAt,
  })

  return { stateEdgeId }
}
