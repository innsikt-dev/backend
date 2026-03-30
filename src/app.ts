import { Hono } from 'hono'
import { dashboard } from './features/dashboard/route.js'
import { historic } from './features/historic/route.js'
import { municipality } from './features/municipality/route.js'
import { comparison } from './features/comparison/route.js'
export const app = new Hono()
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

app.route('/dashboard/', dashboard)
app.route('/historic/', historic)
app.route('/municipality/', municipality)
app.route('/comparison/', comparison)
