import {
  DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
  PRECONDITION_INVALID,
} from '@liquid-bricks/lib-diagnostics/codes'

function ids(value) {
  return (Array.isArray(value) ? value : [value])
    .filter(id => typeof id === 'string' && id.length > 0)
}

function requireSingleId({ handlerDiagnostics, values, requiredMessage, duplicateMessage, meta }) {
  handlerDiagnostics.require(
    values.length > 0,
    DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
    requiredMessage,
    meta,
  )
  handlerDiagnostics.require(
    values.length === 1,
    PRECONDITION_INVALID,
    duplicateMessage,
    { ...meta, ids: values },
  )

  return values[0]
}

async function resolveTargetNodeId({
  dataMapper,
  handlerDiagnostics,
  componentId,
  name,
  type,
}) {
  let values
  if (type === 'data') {
    values = ids(await dataMapper.query.findComponentDataNodeIdByName({
      vertexId: componentId,
      name,
    }))
  } else if (type === 'task') {
    values = ids(await dataMapper.query.findComponentTaskNodeIdByName({
      vertexId: componentId,
      name,
    }))
  } else if (type === 'gate') {
    values = ids(await dataMapper.query.findGateRefIdByAlias({
      vertexId: componentId,
      alias: name,
    }))
  } else {
    handlerDiagnostics.require(
      false,
      PRECONDITION_INVALID,
      'has_log target type must be data, gate, or task',
      { componentId, name, type },
    )
  }

  return requireSingleId({
    handlerDiagnostics,
    values,
    requiredMessage: `${type} target required for has_log projection`,
    duplicateMessage: `${type} target must be unique for has_log projection`,
    meta: { componentId, name, type },
  })
}

async function createLogEdge({
  dataMapper,
  handlerDiagnostics,
  type,
  payload,
}) {
  if (type === 'data') {
    return dataMapper.edge.has_log.componentInstance_data.create(payload)
  }
  if (type === 'task') {
    return dataMapper.edge.has_log.componentInstance_task.create(payload)
  }
  if (type === 'gate') {
    return dataMapper.edge.has_log.componentInstance_gateRef.create(payload)
  }

  handlerDiagnostics.require(
    false,
    PRECONDITION_INVALID,
    'has_log edge type must be data, gate, or task',
    { type },
  )
}

export async function projectLog({
  rootCtx: { dataMapper },
  scope: {
    handlerDiagnostics,
    instanceId,
    logId,
    name,
    type,
    method,
    args,
    updatedAt,
  },
}) {
  const instanceVertexId = requireSingleId({
    handlerDiagnostics,
    values: ids(await dataMapper.query.findComponentInstanceVertexId({ instanceId })),
    requiredMessage: 'componentInstance required for has_log projection',
    duplicateMessage: 'componentInstance must be unique for has_log projection',
    meta: { instanceId },
  })

  const componentId = requireSingleId({
    handlerDiagnostics,
    values: ids(await dataMapper.query.findComponentIdForInstance({
      vertexId: instanceVertexId,
    })),
    requiredMessage: 'component required for has_log projection',
    duplicateMessage: 'component must be unique for has_log projection',
    meta: { instanceId, instanceVertexId },
  })

  const targetNodeId = await resolveTargetNodeId({
    dataMapper,
    handlerDiagnostics,
    componentId,
    name,
    type,
  })

  const existingEdgeIds = ids(await dataMapper.query.findHasLogEdgeId({
    instanceVertexId,
    logId,
  }))
  handlerDiagnostics.require(
    existingEdgeIds.length <= 1,
    PRECONDITION_INVALID,
    'logId must identify at most one has_log edge for an instance',
    { instanceId, instanceVertexId, logId, edgeIds: existingEdgeIds },
  )

  let edgeId = existingEdgeIds[0]
  const edgeCreated = edgeId === undefined
  if (edgeCreated) {
    const created = await createLogEdge({
      dataMapper,
      handlerDiagnostics,
      type,
      payload: {
        fromId: instanceVertexId,
        toId: targetNodeId,
        logId,
        method,
        args,
        updatedAt,
      },
    })
    edgeId = created?.id
    handlerDiagnostics.require(
      typeof edgeId === 'string' && edgeId.length > 0,
      DOMAIN_PROJECTOR_PRECONDITION_REQUIRED,
      'has_log edge id required after creation',
      { instanceId, instanceVertexId, componentId, targetNodeId, logId, name, type },
    )
  } else {
    const existingTargetNodeId = requireSingleId({
      handlerDiagnostics,
      values: ids(await dataMapper.query.findEdgeTargetNodeId({ edgeId })),
      requiredMessage: 'has_log target required during replay',
      duplicateMessage: 'has_log target must be unique during replay',
      meta: { instanceId, instanceVertexId, edgeId, logId },
    })
    handlerDiagnostics.require(
      existingTargetNodeId === targetNodeId,
      PRECONDITION_INVALID,
      'logId must identify the same target during replay',
      {
        instanceId,
        instanceVertexId,
        edgeId,
        logId,
        existingTargetNodeId,
        targetNodeId,
      },
    )
  }

  return {
    instanceId,
    instanceVertexId,
    componentId,
    targetNodeId,
    targetType: type,
    edgeId,
    edgeCreated,
    logId,
    name,
    method,
    args,
    updatedAt,
  }
}
