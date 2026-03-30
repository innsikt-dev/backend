import 'dotenv/config'
import { serve } from '@hono/node-server'
import { runSync } from './sync/index.js'
import { app } from './app.js'

if (process.env.NODE_ENV === 'production') {
  runSync()
}
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
