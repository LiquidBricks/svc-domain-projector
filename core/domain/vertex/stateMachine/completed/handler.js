export async function projectCompleted({
  rootCtx: { dataMapper },
  scope: {
    stateMachineId,
    updatedAt,
  },
}) {
  await dataMapper.vertex.stateMachine.setComplete({
    stateMachineId,
    updatedAt,
  })

  return { stateMachineId }
}
