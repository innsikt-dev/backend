import { Hono } from 'hono'
import { queryMunicipalitiesMeta } from './queries/municipalities-meta.js'
import { queryMunicipalitiesAnalysis } from './queries/municipalities-comparison-analysis.js'
export const comparison = new Hono()

comparison.get('municipalities', async (c) => {
  const municipality1 = c.req.query('municipality1') ?? 'Oslo'
  const municipality2 = c.req.query('municipality2') ?? 'Bergen'

  const data = await queryMunicipalitiesMeta({
    id1: municipality1,
    id2: municipality2,
  })

  return c.json(data)
})

comparison.get('municipalities/analysis', async (c) => {
  const municipality1 = c.req.query('municipality1') ?? 'Oslo'
  const municipality2 = c.req.query('municipality2') ?? 'Bergen'
  const period = c.req.query('periode')

  const data = await queryMunicipalitiesAnalysis({
    id1: municipality1,
    id2: municipality2,
    period: period ?? '',
  })

  return c.json(data)
})
