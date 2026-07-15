import test from 'node:test'
import assert from 'node:assert/strict'

import { create as createSubject } from '@liquid-bricks/lib-nats-subject/create/basic'

import { subjectDefinition } from '../../../../../../core/domain/vertex/stateMachine/completed/subjectDefinition.js'

test('completion subject definition works without a published catalog leaf', () => {
  assert.equal(
    createSubject(subjectDefinition).forSubscribe().build(),
    '*.domain.*.*.vertex.stateMachine.completed.v1.*',
  )
})
