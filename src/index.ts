import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { fetchPoliceLog } from './api/police/index.js'
import { transformPoliceLog } from './api/police/transform.js'
import { dashboard } from './features/dashboard/route.js'
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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
