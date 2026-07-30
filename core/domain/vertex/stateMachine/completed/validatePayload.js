import { DOMAIN_PROJECTOR_PRECONDITION_REQUIRED } from '@liquid-bricks/lib-diagnostics/codes'

export function validatePayload({
  scope: {
    handlerDiagnostics,
    stateMachineId,
    updatedAt,
  },
}) {
  handlerDiagnostics.require(
    typeof stateMachineId === 'string' && stateMachineId.length,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    'stateMachineId required for stateMachine completed projection',
    { field: 'stateMachineId' },
  )

  return {
    updatedAt: updatedAt || new Date().toISOString(),
  }
}
