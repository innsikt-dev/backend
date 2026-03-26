import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { fetchPoliceLog } from './api/police/index.js'
import { transformPoliceLog } from './api/police/transform.js'
const app = new Hono()

app.get('/', async (c) => {
  const data = await fetchPoliceLog()
  const transformed = await transformPoliceLog(data)
  return c.text('hello')
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
