import { Hono } from 'hono'
import { queryHistoricAnalysis } from './historic-analysis.js'
export const analytics = new Hono()

analytics.get('/', async (c) => {
  const period = c.req.query('period')
  const data = await queryHistoricAnalysis(period ?? '')

  return c.json(data)
})
