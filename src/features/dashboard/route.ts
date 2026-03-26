import { Hono } from 'hono'
import { queryDashboardKpi } from './queries/dashboard-kpi.js'
import { queryDashboardEvents } from './queries/dashboard-events.js'

export const dashboard = new Hono()

dashboard.get('kpi', async (c) => {
  const data = await queryDashboardKpi()
  return c.json(data)
})

dashboard.get('events', async (c) => {
  const data = await queryDashboardEvents()
  return c.json(data)
})
