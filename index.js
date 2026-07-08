import { AckPolicy, DeliverPolicy } from '@nats-io/jetstream'
import { create as createBasicSubject } from '@liquid-bricks/lib-nats-subject/create/basic'
import { events as natsEvents } from '@liquid-bricks/lib-nats-subject/events/nats'
import { createDomainProjectorRouter } from './router.js'

const domainEdgeSubjectSpec = natsEvents['*']?.domain?.['*']?.['*']?.edge?.['>'] ?? {
  env: '*',
  ns: 'domain',
  tenant: '*',
  context: '*',
  channel: 'edge',
  entity: '>',
}

const consumerName = 'domainProjectorConsumer'

export async function Consumer({ streamName, natsContext, g, diagnostics: d }) {
  const diagnostics = d.child({ consumerName })

  const jetstream = await natsContext.jetstream()
  const jetstreamManager = await natsContext.jetstreamManager()

  try {
    await jetstreamManager.consumers.delete(streamName, consumerName)
  } catch (_) { /* ignore if not found or unsupported */ }

  await jetstreamManager.consumers.add(streamName, {
    durable_name: consumerName,
    ack_policy: AckPolicy.Explicit,
    deliver_policy: DeliverPolicy.All,
    filter_subjects: [
      createBasicSubject(domainEdgeSubjectSpec).forSubscribe().build(),
    ],
  })

  const consumer = await jetstream.consumers.get(streamName, consumerName)
  const iter = await consumer.consume()
  const r = createDomainProjectorRouter({ natsContext, g, diagnostics })

  new Promise(async () => {
    for await (const m of iter) {
      await r.request({
        subject: m.subject,
        message: m,
      })
    }
  })
}
