import { Hono } from 'hono'
import { queryMunicipality } from './queries/municipality.js'
import { queryMunicipalities } from './queries/municipalities.js'
import { queryAnalytics } from './queries/analytics.js'

export const municipality = new Hono()

municipality.get('municipalities', async (c) => {
  const data = await queryMunicipalities()
  return c.json(data)
})

municipality.get(':id', async (c) => {
  const id = c.req.param('id')
  const data = await queryMunicipality(id)
  return c.json(data)
})

municipality.get('/analytics/:id', async (c) => {
  const id = c.req.param('id')
  const period = c.req.query('period')
  const data = await queryAnalytics(id, period ?? '')
  return c.json(data)
})
