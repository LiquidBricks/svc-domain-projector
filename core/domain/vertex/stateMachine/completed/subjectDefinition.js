import { events as natsEvents } from '@liquid-bricks/lib-nats-subject/events/nats'

const fallbackSubjectDefinition = {
  env: '*',
  ns: 'domain',
  tenant: '*',
  context: '*',
  channel: 'vertex',
  entity: 'stateMachine',
  action: 'completed',
  version: 'v1',
  id: '*',
}

export const subjectDefinition =
  natsEvents?.['*']?.domain?.['*']?.['*']?.vertex?.stateMachine?.completed?.v1?.['*']
  ?? fallbackSubjectDefinition
