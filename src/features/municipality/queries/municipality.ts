import * as db from '../../../db/index.js'
export async function queryMunicipality(id: string) {
  const municipality = await db.query(
    `
        SELECT
            m.id,
            m.municipality_name,
            p.district_name
        FROM 
            municipality m
        JOIN 
            police_district p 
        ON 
            p.id = m.police_district_id  
        WHERE 
            LOWER(municipality_name ) = LOWER($1)
        ORDER BY 
            police_district_id DESC;
        `,
    [id]
  )

  const incidents = await db.query(
    `
    SELECT 
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM
        incidents i
    JOIN municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        LOWER(m.municipality_name) = LOWER($1);
    `,
    [id]
  )

  const commonCategory = await db.query(
    `
    SELECT 
       c.type AS category
    FROM
        incidents i
    JOIN municipality m 
    ON 
        m.id = i.municipality_id
    JOIN 
        category c 
    ON 
        c.id = i.category_id  
    WHERE 
        LOWER(m.municipality_name) = LOWER($1)
    GROUP BY 
        m.municipality_name, c.type
    ORDER BY 
        COUNT(DISTINCT i.thread_id) DESC
    LIMIT 1;`,
    [id]
  )

  const datasetDays = await db.query(
    `
    SELECT 
        COUNT(DISTINCT i.thread_id)::int AS amount FROM incidents i
    JOIN 
        municipality m 
    ON 
        m.id = i.municipality_id
    WHERE LOWER(municipality_name) = LOWER($1);`,
    [id]
  )

  return {
    municipality: municipality.rows.length === 0 ? [] : municipality.rows[0],
    kpi: {
      incidents: incidents.rows,
      commonCategory: commonCategory.rows,
      datasetDays: datasetDays.rows,
    },
  }
}
