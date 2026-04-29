import { Hono } from 'hono'
import { runSync } from '../../sync/index.js'

export const sync = new Hono()

sync.post('/revalidate', async (c) => {
  const syncSuccess = await runSync()
  if (!syncSuccess) return c.json({}, 400)
  return c.json({ status: 'ok' })
})
