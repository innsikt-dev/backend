import { Hono } from 'hono'
import { queryHistoricAnalysis } from './historic-analysis.js'
export const historic = new Hono()

historic.get('analysis', async (c) => {
  const period = c.req.query('periode')
  const data = await queryHistoricAnalysis(period || '')

  return c.json(data)
})
