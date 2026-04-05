import { Hono } from 'hono'
import { queryDistrictsKpi } from './queries/districts-kpi.js'

export const districts = new Hono()

districts.get('kpi', async (c) => {
  const data = await queryDistrictsKpi()
  return c.json(data)
})
