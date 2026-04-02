import { Hono } from 'hono'
import { queryMunicipalities } from './queries/municipalities.js'
import { queryAnalytics } from './queries/analytics.js'
export const comparison = new Hono()

comparison.get('municipalities', async (c) => {
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

comparison.get('municipalities/analytics', async (c) => {
  const period = c.req.query('period') ?? '7d'
  const municipality1 = c.req.query('municipality1') ?? 'Oslo'
  const municipality2 = c.req.query('municipality2') ?? 'Bergen'

  const data = await queryAnalytics({
    id1: municipality1,
    id2: municipality2,
    period: period,
  })

  return c.json(data)
})
