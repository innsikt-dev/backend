import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as db from '../src/db/index.js'
const app = new Hono()

app.get('/', async (c) => {
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
