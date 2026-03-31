import * as db from '../../../db/index.js'
export async function queryDashboard() {
  const totalIncidents = await db.query(
    `SELECT COUNT(DISTINCT thread_id)::int AS total_incidents FROM mv_dashboard_base
      WHERE created_on::date = CURRENT_DATE;`,
    []
  )
  const mostActiveDistrict = await db.query(
    `SELECT municipality_name, COUNT(DISTINCT thread_id) AS most_active_district
      FROM mv_dashboard_base
      WHERE created_on::date = CURRENT_DATE
      GROUP BY municipality_name
      ORDER BY COUNT(*) DESC
      LIMIT 1;`,
    []
  )
  const mostCommonCategory = await db.query(
    `SELECT type AS category, COUNT(DISTINCT thread_id)
      FROM mv_dashboard_base
      WHERE created_on::date = CURRENT_DATE
      GROUP BY category
      ORDER BY COUNT(*) DESC
      LIMIT 1;`,
    []
  )

  const totalCategories = await db.query(
    `
    SELECT 
        type AS category, 
        COUNT(DISTINCT thread_id)::int AS amount
    FROM 
        mv_dashboard_base
    WHERE 
        created_on::date = CURRENT_DATE
    AND is_active = true    
    GROUP BY 
        category
    ORDER BY 
        COUNT(*) DESC;
    `,
    []
  )
  const activeIncidents = await db.query(
    `SELECT 
        COUNT(DISTINCT thread_id)::int AS active_incidents
    FROM 
            mv_dashboard_base
    WHERE 
            is_active = true 
    AND 
            created_on::date = CURRENT_DATE;`,
    []
  )
  const events = await db.query(
    `
    SELECT * FROM (
    SELECT DISTINCT ON (i.thread_id)
        m.id,
        m.municipality_name,
        m.lat,
        m.lng,
        i.thread_id,
        i.area,
        i.text,
        c.type,
        i.created_on,
        i.updated_on,
        i.is_active
    FROM 
        incidents i
    JOIN category c 
    ON c.id = i.category_id
      JOIN municipality m ON m.id = i.municipality_id
      WHERE created_on::date = CURRENT_DATE AND is_active = true
      ORDER BY i.thread_id, i.created_on ASC
  ) sub
  ORDER BY is_active DESC, created_on DESC;
  `,
    []
  )

  return {
    totalCategories: totalCategories.rows,
    kpi: {
      totalIncidents: totalIncidents.rows[0]?.total_incidents ?? 0,
      mostActiveDistrict: mostActiveDistrict.rows[0]?.municipality_name ?? null,
      mostCommonCategory: mostCommonCategory.rows[0]?.category ?? null,
      activeIncidents: activeIncidents.rows[0]?.active_incidents ?? 0,
    },
    events: events.rows,
  }
}
