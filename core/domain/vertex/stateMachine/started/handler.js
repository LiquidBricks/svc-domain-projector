export async function projectStarted({
  rootCtx: { dataMapper },
  scope: {
    stateMachineId,
    updatedAt,
  },
}) {
  await dataMapper.vertex.stateMachine.setRunning({
    stateMachineId,
    updatedAt,
  })

  return { stateMachineId }
}
