import * as db from '../../../db/index.js'
export async function queryMunicipalityNames() {
  const query = await db.query('SELECT municipality_name FROM municipality', [])

  return query.rows.map((d) => d.municipality_name) ?? []
}
