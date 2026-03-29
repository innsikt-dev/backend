import * as db from '../../../db/index.js'
import { isValidRange } from '../../../lib/config/is-valid-range.js'
export async function queryMunicipalityAnalysis(id: string, period: string) {
  const validRange = isValidRange(period)
  const incidentsOverTime = await db.query(
    `
    SELECT
        i.created_on::date as date,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM 
        incidents i
    JOIN 
        municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        LOWER(m.municipality_name) = LOWER($1)
    AND
        created_on > NOW() - $2::interval
    GROUP BY 
        created_on::date
    ORDER BY 
        date 
    ASC;`,
    [id, validRange]
  )

  const categoryDistribution = await db.query(
    `
    SELECT
        c.type as category,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM 
        incidents i
    JOIN municipality m 
    ON 
        m.id = i.municipality_id
    JOIN category c 
    ON 
        c.id = i.category_id
    WHERE 
        LOWER(m.municipality_name) = LOWER($1)
      AND
        created_on > NOW() - $2::interval    
    GROUP BY 
        m.municipality_name, c.type
    ORDER BY 
        amount 
    ASC;`,
    [id, validRange]
  )

  const events = await db.query(
    `
    SELECT
        i.created_on as date,
        i.text,
        c.type as category
    FROM 
        incidents i
    JOIN 
        municipality m 
    ON 
        m.id = i.municipality_id 
    JOIN 
        category C 
    ON 
        c.id = i.category_id
    WHERE 
        LOWER(m.municipality_name) = LOWER($1) 
    AND 
        created_on > NOW() - $2::interval
    ORDER BY i.created_on DESC;
    `,
    [id, validRange]
  )

  return {
    incidentsOverTime: incidentsOverTime.rows,
    categoryDistribution: categoryDistribution.rows,
    events: events.rows,
  }
}
