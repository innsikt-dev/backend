import * as db from '../../../db/index.js'

export async function queryMunicipalities() {
  const municipalityName = await db.query(
    'SELECT municipality_name FROM municipality ORDER BY municipality_name',
    []
  )

  return municipalityName.rows.length === 0 ? [] : municipalityName.rows
}
