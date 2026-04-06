import { Hono } from 'hono'
import { queryDistrictsKpi } from './queries/districts-kpi.js'
import { queryAnalytics } from './queries/analytics.js'

export const districts = new Hono()

districts.get('kpi', async (c) => {
  const data = await queryDistrictsKpi()
  return c.json(data)
})

districts.get('analytics', async (c) => {
  const district = c.req.query('district')
  const period = c.req.query('period') ?? '7d'
  console.log(district, period)
  const data = await queryAnalytics(district, period)
  return c.json(data)
})
