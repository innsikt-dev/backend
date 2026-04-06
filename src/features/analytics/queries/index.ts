import * as db from '../../../db/index.js'
import { isValidRange } from '../../../lib/config/is-valid-range.js'
import type { AnalyticsQueryResult } from './types.js'

export async function queryAnalytics(
  period: string
): Promise<AnalyticsQueryResult | []> {
  const validRange = isValidRange(period)
  const heatmap = await db.query(
    `
        SELECT 
            EXTRACT(DOW FROM created_on)::int AS day,
            EXTRACT(HOUR FROM created_on)::int AS time,
            COUNT(*)::int AS amount
        FROM 
            incidents
        WHERE 
            created_on >= NOW() - $1::interval
        GROUP BY 
            day, time
        ORDER BY 
            day, time;
        `,
    [validRange]
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
        created_on > NOW () - $1::interval 
    GROUP BY 
        c.type,  DATE_TRUNC('day', created_on)
    ORDER BY 
        DATE_TRUNC('day', created_on) ASC;
    `,
    [validRange]
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
        created_on >= NOW() - $1::interval
    GROUP BY 
        m.municipality_name
    ORDER BY 
        amount DESC
    LIMIT 10;
    `,
    [validRange]
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
        created_on > NOW () - $1::interval  
    GROUP BY 
        c.type
    ORDER BY 
        amount DESC
    LIMIT 10;
    `,
    [validRange]
  )
  return {
    heatMap: heatmap.rows,
    trends: trends.rows,
    topMunicipalities: topMunicipalities.rows,
    categoryDistribution: categoryDistribution.rows,
  }
}
