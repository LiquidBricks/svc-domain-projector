import { create as createSubject } from '@liquid-bricks/lib-nats-subject/create/basic'
import { subjectDefinition } from './subjectDefinition.js'

export const path = createSubject(subjectDefinition)
  .forSubscribe()
  .toObject()
