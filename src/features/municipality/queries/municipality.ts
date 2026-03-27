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

  const municipalityIncidents = await db.query(
    `
    SELECT 
        m.municipality_name,
        COUNT(*)::int as amount
    FROM
        incidents i
    JOIN municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        LOWER(m.municipality_name) = LOWER($1) 
    GROUP BY 
        m.municipality_name;


    `,
    [id]
  )

  const municipalityCommonCategory = await db.query(
    `
    SELECT 
        m.municipality_name,
        COUNT(c.type)::int as category
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
        COUNT(c.type) DESC
    LIMIT 1;`,
    [id]
  )

  const daysWithData = await db.query(
    `
    SELECT 
        COUNT(i.id)::int AS amount FROM incidents i
    JOIN 
        municipality m 
    ON 
        m.id = i.municipality_id
    WHERE LOWER(municipality_name) = LOWER($1);`,
    [id]
  )

  return {
    municipality: municipality.rows.length === 0 ? [] : municipality.rows[0],
    municipalityIncidents:
      municipalityIncidents.rows.length === 0
        ? []
        : municipalityIncidents.rows[0].amount,

    municipalityCommonCategory:
      municipalityCommonCategory.rows.length === 0
        ? []
        : municipalityCommonCategory.rows[0].category,
    daysWithData:
      daysWithData.rows.length === 0 ? [] : daysWithData.rows[0].amount,
  }
}
