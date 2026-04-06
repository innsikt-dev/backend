import { Hono } from 'hono'
import { queryDashboardIncidents } from './queries/incidents.js'
import { queryDashboard } from './queries/dashboard.js'

export const dashboard = new Hono()
dashboard.get('/', async (c) => {
  const data = await queryDashboard()
  return c.json(data)
})

dashboard.get('threads/:threadId', async (c) => {
  const threadId = c.req.param('threadId')
  const data = await queryDashboardIncidents(threadId)
  return c.json(data)
})
