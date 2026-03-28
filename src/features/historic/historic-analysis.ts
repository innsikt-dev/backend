import * as db from '../../db/index.js'
export async function queryHistoricAnalysis() {
  const heatmap = await db.query(
    `
        SELECT 
            EXTRACT(DOW FROM created_on)::int AS day,
            EXTRACT(HOUR FROM created_on)::int AS time,
            COUNT(*)::int AS amount
        FROM 
            incidents
        WHERE 
            created_on >= NOW() - INTERVAL '30 days'
        GROUP BY 
            day, time
        ORDER BY 
            day, time;
        `,
    []
  )
  const trends = await db.query(
    `
    SELECT 
        DATE_TRUNC('day', created_on) as date,
        c.type as category,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM 
        incidents i
    JOIN category c 
        ON c.id = i.category_id
    WHERE 
        created_on > NOW () - INTERVAL '30 days'  
    GROUP BY 
        c.type,  DATE_TRUNC('day', created_on)
    ORDER BY 
        DATE_TRUNC('day', created_on) ASC;
    `,
    []
  )

  const topMunicipalities = await db.query(
    `
    SELECT
        m.municipality_name,
        COUNT(DISTINCT i.thread_id)::int AS amount
    FROM 
        incidents i
    JOIN 
        municipality m 
    ON 
        m.id = i.municipality_id
    WHERE 
        created_on >= NOW() - INTERVAL '30 days'
    GROUP BY 
        m.municipality_name
    ORDER BY 
        amount DESC
    LIMIT 5;
    `,
    []
  )

  const categoryDistribution = await db.query(
    `
    SELECT
        c.type as category,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM 
        incidents i
    JOIN category c 
        ON c.id = i.category_id
    WHERE 
        created_on > NOW () - INTERVAL '30 days'  
    GROUP BY 
        c.type
    ORDER BY 
        amount DESC
    LIMIT 5;
    `,
    []
  )
  return {
    heatMap: heatmap.rows.length === 0 ? [] : heatmap.rows,
    trends: trends.rows.length === 0 ? [] : trends.rows,
    topMunicipalities:
      topMunicipalities.rows.length === 0 ? [] : topMunicipalities.rows,
    categoryDistribution:
      categoryDistribution.rows.length === 0 ? [] : categoryDistribution.rows,
  }
}
