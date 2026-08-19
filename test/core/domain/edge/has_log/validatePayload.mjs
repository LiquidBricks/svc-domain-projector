import test from 'node:test'
import assert from 'node:assert/strict'

import { validatePayload } from '../../../../../core/domain/edge/has_log/validatePayload.js'

function diagnostics() {
  return {
    require(condition, code, message) {
      if (condition) return
      const error = new Error(message)
      error.code = code
      throw error
    },
  }
}

function scope(overrides = {}) {
  return {
    handlerDiagnostics: diagnostics(),
    subjectParams: { action: 'error', id: 'instance-1' },
    instanceId: 'instance-1',
    logId: 'log-1',
    name: 'inspectContainer',
    type: 'task',
    method: 'error',
    args: ['inspect failed'],
    updatedAt: '2026-08-15T12:34:56.000Z',
    ...overrides,
  }
}

test('has_log projection validation accepts a path-aligned log fact', () => {
  assert.deepEqual(validatePayload({ scope: scope() }), {
    updatedAt: '2026-08-15T12:34:56.000Z',
  })
})

test('has_log projection validation rejects malformed or mismatched facts', () => {
  for (const invalidScope of [
    scope({ logId: '' }),
    scope({ type: 'unknown' }),
    scope({ args: {} }),
    scope({ method: 'warn' }),
    scope({ instanceId: 'instance-2' }),
    scope({ updatedAt: 'not-a-date' }),
  ]) {
    assert.throws(
      () => validatePayload({ scope: invalidScope }),
      (error) => typeof error.code === 'string',
    )
  }
})
