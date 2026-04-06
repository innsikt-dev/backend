import { Hono } from 'hono'
import { dashboard } from './features/dashboard/route.js'
import { analytics } from './features/analytics/route.js'
import { explore } from './features/explore/route.js'
import { districts } from './features/districts/route.js'
import { sseHandler } from './stream/index.js'
export const app = new Hono()
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})
app.get('/sse', (c) => sseHandler(c))
app.route('/dashboard/', dashboard)
app.route('/analytics', analytics)
app.route('/explore/', explore)
app.route('/districts/', districts)
