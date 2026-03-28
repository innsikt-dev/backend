import * as db from '../../../db/index.js'
import type { Payload } from './types.js'

export async function queryMunicipalitiesMeta(payload: Payload) {
  const result = await db.query(
    `
    SELECT
      m.municipality_name,
      COUNT(c.type)::int as amount
    FROM 
      incidents i
    JOIN 
      category c 
        ON c.id = i.category_id
    JOIN 
      municipality m 
        ON m.id = i.municipality_id
    WHERE 
      LOWER(m.municipality_name) IN (LOWER($1), LOWER($2))
    AND 
      created_on > NOW() - INTERVAL '30 days'
    GROUP BY
      m.municipality_name;
    `,
    [payload.id1, payload.id2]
  )

  const findMunicipality = (name: string) =>
    result.rows.find(
      (r) => r.municipality_name.toLowerCase() === name.toLowerCase()
    ) ?? []

  return {
    municipalityOne: findMunicipality(payload.id1),
    municipalityTwo: findMunicipality(payload.id2),
  }
}
