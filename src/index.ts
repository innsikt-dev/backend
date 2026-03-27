import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { dashboard } from './features/dashboard/route.js'
import { historic } from './features/historic/route.js'
import { municipality } from './features/municipality/route.js'
const app = new Hono()
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
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
