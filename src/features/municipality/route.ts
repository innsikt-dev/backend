import { Hono } from 'hono'
import { queryMunicipalityName } from './queries/municipality-name.js'
import { queryMunicipality } from './queries/municipality.js'
import { queryMunicipalityAnalysis } from './queries/municipality-analysis.js'

export const municipality = new Hono()

municipality.get('municipalities', async (c) => {
  const data = await queryMunicipalityName()
  return c.json(data)
})

municipality.get(':id', async (c) => {
  const id = c.req.param('id')
  const data = await queryMunicipality(id)
  return c.json(data)
})

municipality.get('/analysis/:id', async (c) => {
  const id = c.req.param('id')
  const period = c.req.query('period')
  const data = await queryMunicipalityAnalysis(id, period ?? '')
  return c.json(data)
})
