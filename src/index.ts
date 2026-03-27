import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { fetchPoliceLog } from './api/police/index.js'
import { transformPoliceLog } from './api/police/transform.js'
import { dashboard } from './features/dashboard/route.js'
import { historic } from './features/historic/route.js'
import { municipality } from './features/municipality/route.js'
import { runSync } from './sync/index.js'
const app = new Hono()
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

app.get('/', async (c) => {
  const data = await fetchPoliceLog()
  const transformed = await transformPoliceLog(data)
  return c.text('hello')
})
app.route('/dashboard/', dashboard)
app.route('/historic/', historic)
app.route('/municipality/', municipality)
/* runSync() */
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
