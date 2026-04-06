import { streamSSE } from 'hono/streaming'
import type { Context } from 'hono'

const clients = new Set<(data: string) => void>()

export function notifyClients(count: number) {
  clients.forEach((send) => send(JSON.stringify({ count })))
}

export function sseHandler(c: Context) {
  return streamSSE(c, async (stream) => {
    const send = (data: string) =>
      stream.writeSSE({ data, event: 'new-incidents' })

    stream.onAbort(() => {
      clients.delete(send)
    })
    clients.add(send)

    while (!stream.aborted) {
      await stream.sleep(30000)
    }
  })
}
