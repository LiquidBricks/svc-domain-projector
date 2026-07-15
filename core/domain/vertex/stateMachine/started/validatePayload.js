import { Errors } from '../../../../../errors.js'

export function validatePayload({
  scope: {
    handlerDiagnostics,
    stateMachineId,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof stateMachineId === 'string' && stateMachineId.length,
    Errors.PRECONDITION_REQUIRED,
    'stateMachineId required for stateMachine started projection',
    { field: 'stateMachineId' },
  )
  handlerDiagnostics.require(
    typeof updatedAt === 'string' && updatedAt.length,
    Errors.PRECONDITION_REQUIRED,
    'updatedAt required for stateMachine started projection',
    { field: 'updatedAt' },
  )

  return { updatedAt }
}
