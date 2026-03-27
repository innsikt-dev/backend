import * as db from '../../../db/index.js'
export async function queryMunicipalityAnalysis(id: string) {
  const incidentsOverTime = await db.query(
    `
    SELECT
        i.created_on::date as date,
        COUNT(*)::int as amount
    FROM 
        incidents i
    JOIN 
        municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        LOWER(m.municipality_name) = LOWER($1)
    GROUP BY 
        created_on::date
    ORDER BY 
        date 
    ASC;`,
    [id]
  )

  const categoryDistribution = await db.query(
    `
    SELECT
        c.type as category,
        COUNT(*)::int as amount
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
    GROUP BY 
        m.municipality_name, c.type
    ORDER BY 
        amount 
    ASC;`,
    [id]
  )

  const events = await db.query(
    `
    SELECT
  i.created_on as date,
  i.text,
  c.type as category
FROM incidents i
JOIN municipality m ON m.id = i.municipality_id 
JOIN category C on c.id = i.category_id
WHERE LOWER(m.municipality_name) = LOWER($1) 
AND created_on > NOW () - INTERVAL '10 DAYS'
ORDER BY i.created_on DESC;
    `,
    [id]
  )

  return {
    incidentsOverTime:
      incidentsOverTime.rows.length === 0 ? [] : incidentsOverTime.rows,
    categoryDistribution:
      categoryDistribution.rows.length === 0 ? [] : categoryDistribution.rows,
    events: events.rows.length === 0 ? [] : events.rows,
  }
}
