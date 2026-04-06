import * as db from '../../../db/index.js'
import type { MunicipalityNamesQueryResult } from './types.js'
export async function queryMunicipalityNames(): Promise<
  MunicipalityNamesQueryResult[]
> {
  const query = await db.query('SELECT municipality_name FROM municipality', [])
  console.log(query.rows)
  return query.rows.map((d) => d.municipality_name) ?? []
}
