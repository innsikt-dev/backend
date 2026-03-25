import { Pool } from 'pg'
import { DATABASE_URL } from '../lib/env.js'
const pool = new Pool({
  connectionString: DATABASE_URL,
})

export const query = (query: string, params: any[]) => {
  return pool.query(query, params)
}
