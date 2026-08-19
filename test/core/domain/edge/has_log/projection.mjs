import test from 'node:test'
import assert from 'node:assert/strict'

import { projectLog } from '../../../../../core/domain/edge/has_log/handler.js'

function diagnostics() {
  return {
    require(condition, code, message, meta) {
      if (condition) return
      const error = new Error(message)
      error.code = code
      error.meta = meta
      throw error
    },
  }
}

function projectArgs({
  type = 'task',
  existingEdgeIds = [],
  existingTargetNodeIds,
} = {}) {
  const calls = []
  const targetIds = {
    data: 'data-node-1',
    gate: 'gate-ref-1',
    task: 'task-node-1',
  }
  const dataMapper = {
    query: {
      async findComponentInstanceVertexId(payload) {
        calls.push(['findComponentInstanceVertexId', payload])
        return ['instance-vertex-1']
      },
      async findComponentIdForInstance(payload) {
        calls.push(['findComponentIdForInstance', payload])
        return ['component-1']
      },
      async findComponentDataNodeIdByName(payload) {
        calls.push(['findComponentDataNodeIdByName', payload])
        return [targetIds.data]
      },
      async findComponentTaskNodeIdByName(payload) {
        calls.push(['findComponentTaskNodeIdByName', payload])
        return [targetIds.task]
      },
      async findGateRefIdByAlias(payload) {
        calls.push(['findGateRefIdByAlias', payload])
        return [targetIds.gate]
      },
      async findHasLogEdgeId(payload) {
        calls.push(['findHasLogEdgeId', payload])
        return existingEdgeIds
      },
      async findEdgeTargetNodeId(payload) {
        calls.push(['findEdgeTargetNodeId', payload])
        return existingTargetNodeIds ?? [targetIds[type]]
      },
    },
    edge: {
      has_log: {
        componentInstance_data: {
          async create(payload) {
            calls.push(['createDataHasLog', payload])
            return { id: 'has-log-edge-created' }
          },
        },
        componentInstance_gateRef: {
          async create(payload) {
            calls.push(['createGateHasLog', payload])
            return { id: 'has-log-edge-created' }
          },
        },
        componentInstance_task: {
          async create(payload) {
            calls.push(['createTaskHasLog', payload])
            return { id: 'has-log-edge-created' }
          },
        },
      },
    },
  }

  return {
    calls,
    args: {
      rootCtx: { dataMapper },
      scope: {
        handlerDiagnostics: diagnostics(),
        instanceId: 'instance-1',
        logId: 'log-1',
        name: 'inspectContainer',
        type,
        method: 'error',
        args: ['inspect failed', { code: 125 }],
        updatedAt: '2026-08-15T12:34:56.000Z',
      },
    },
  }
}

test('has_log projection creates a unique edge to the existing task node', async () => {
  const { calls, args } = projectArgs()
  const result = await projectLog(args)

  assert.deepEqual(calls, [
    ['findComponentInstanceVertexId', { instanceId: 'instance-1' }],
    ['findComponentIdForInstance', { vertexId: 'instance-vertex-1' }],
    ['findComponentTaskNodeIdByName', {
      vertexId: 'component-1',
      name: 'inspectContainer',
    }],
    ['findHasLogEdgeId', {
      instanceVertexId: 'instance-vertex-1',
      logId: 'log-1',
    }],
    ['createTaskHasLog', {
      fromId: 'instance-vertex-1',
      toId: 'task-node-1',
      logId: 'log-1',
      method: 'error',
      args: ['inspect failed', { code: 125 }],
      updatedAt: '2026-08-15T12:34:56.000Z',
    }],
  ])
  assert.deepEqual(result, {
    instanceId: 'instance-1',
    instanceVertexId: 'instance-vertex-1',
    componentId: 'component-1',
    targetNodeId: 'task-node-1',
    targetType: 'task',
    edgeId: 'has-log-edge-created',
    edgeCreated: true,
    logId: 'log-1',
    name: 'inspectContainer',
    method: 'error',
    args: ['inspect failed', { code: 125 }],
    updatedAt: '2026-08-15T12:34:56.000Z',
  })
})

test('has_log projection selects the edge variant matching the compute node type', async () => {
  for (const [type, lookup, create] of [
    ['data', 'findComponentDataNodeIdByName', 'createDataHasLog'],
    ['gate', 'findGateRefIdByAlias', 'createGateHasLog'],
    ['task', 'findComponentTaskNodeIdByName', 'createTaskHasLog'],
  ]) {
    const { calls, args } = projectArgs({ type })
    const result = await projectLog(args)

    assert.equal(calls.some(([method]) => method === lookup), true)
    assert.equal(calls.some(([method]) => method === create), true)
    assert.equal(result.targetType, type)
  }
})

test('has_log projection reuses an already projected edge on replay', async () => {
  const { calls, args } = projectArgs({
    existingEdgeIds: ['has-log-edge-1'],
  })

  const result = await projectLog(args)

  assert.deepEqual(calls.map(([method]) => method), [
    'findComponentInstanceVertexId',
    'findComponentIdForInstance',
    'findComponentTaskNodeIdByName',
    'findHasLogEdgeId',
    'findEdgeTargetNodeId',
  ])
  assert.equal(result.edgeCreated, false)
  assert.equal(result.edgeId, 'has-log-edge-1')
})
