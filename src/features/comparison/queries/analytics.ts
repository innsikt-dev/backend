import * as db from '../../../db/index.js'
import { isValidRange } from '../../../lib/config/is-valid-range.js'
import type { Payload } from './types.js'

export async function queryAnalytics(payload: Payload) {
  const validRange = isValidRange(payload.period ?? '')

  const keywordIncidents = await db.query(
    `
    SELECT
        m.municipality_name,
        c.type as category,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM 
        incidents i
    JOIN 
        category c 
    ON 
        c.id = i.category_id
    JOIN    
        municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        LOWER(m.municipality_name) IN (LOWER($1), LOWER($2))
    AND
        created_on > NOW() - $3::interval
    GROUP BY 
        municipality_name,c.type
    ORDER BY 
        municipality_name
    
    `,
    [payload.id1, payload.id2, validRange]
  )

  const incidentsOverTime = await db.query(
    `
    SELECT
        m.municipality_name,
        i.created_on::date as date,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM 
        incidents i
    JOIN municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        LOWER(m.municipality_name) IN (LOWER($1), LOWER($2))
    AND
        created_on > NOW() - $3::interval
    GROUP BY 
        m.municipality_name, i.created_on::date
    ORDER BY 
        date, municipality_name ASC;
`,
    [payload.id1, payload.id2, validRange]
  )

  return {
    keywordIncidents: keywordIncidents.rows,
    incidentsOverTime: incidentsOverTime.rows,
  }
}
