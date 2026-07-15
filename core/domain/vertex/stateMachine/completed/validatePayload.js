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
    'stateMachineId required for stateMachine completed projection',
    { field: 'stateMachineId' },
  )

  return {
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
