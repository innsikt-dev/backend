import { Hono } from 'hono'
import { queryAnalytics } from './queries/index.js'
export const analytics = new Hono()

analytics.get('/', async (c) => {
  const period = c.req.query('period')
  const data = await queryAnalytics(period ?? '')
  return c.json(data)
})
