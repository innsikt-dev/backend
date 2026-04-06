import { Hono } from 'hono'
import { queryMunicipalities } from './queries/municipalities.js'
import { queryAnalytics } from './queries/analytics.js'
import { queryMunicipalityNames } from './queries/names.js'

export const explore = new Hono()

explore.get('/municipalities/names', async (c) => {
  const municipalities = await queryMunicipalityNames()
  return c.json(municipalities)
})
explore.get('municipalities', async (c) => {
  const period = c.req.query('period') ?? '7d'
  const municipality1 = c.req.query('municipality1') ?? 'Oslo'
  const municipality2 = c.req.query('municipality2') ?? 'Bergen'

  const data = await queryMunicipalities({
    id1: municipality1,
    id2: municipality2,
    period,
  })

  return c.json(data)
})

explore.get('municipalities/analytics', async (c) => {
  const period = c.req.query('period') ?? '7d'
  const municipality1 = c.req.query('municipality1') ?? 'Oslo'
  const municipality2 = c.req.query('municipality2') ?? 'Bergen'
  const perCapita = c.req.query('perCapita') ?? ''

  const data = await queryAnalytics({
    id1: municipality1,
    id2: municipality2,
    period: period,
    perCapita: perCapita,
  })

  return c.json(data)
})
