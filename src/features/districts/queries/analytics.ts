import * as db from '../../../db/index.js'
import { isValidRange } from '../../../lib/config/is-valid-range.js'
import type { DistrictAnalytics } from './types.js'
export async function queryAnalytics(
  district: string | undefined,
  period: string
): Promise<DistrictAnalytics> {
  const validRange = isValidRange(period)
  const trends = await db.query(
    `
    SELECT 
        pd.district_name,
        COUNT(distinct i.thread_id)::int AS amount,
        DATE(created_on)
    FROM 
        incidents i
    JOIN municipality m 
        ON m.id = i.municipality_id 
    JOIN category c 
        ON c.id = i.category_id  
    JOIN police_district pd 
        ON pd.id = m.police_district_id
    WHERE 
        ($1::TEXT IS NULL  OR LOWER(district_name) = LOWER($1))
    AND 
        created_on > NOW() - $2::interval
    GROUP BY   
        district_name, date(created_on)
    ORDER BY 
        DATE(CREATED_ON)

    `,
    [district, validRange]
  )
  const categoryDistribution = await db.query(
    `
    SELECT
        c.type as category,
        COUNT(DISTINCT i.thread_id)::int as amount
    FROM  
        incidents i
    JOIN municipality m 
        ON m.id = i.municipality_id
    JOIN category c 
        ON c.id = i.category_id
    JOIN police_district pd 
        ON pd.id = m.police_district_id
    WHERE 
        ($1::TEXT IS NULL  OR LOWER(district_name) = LOWER($1))
    AND 
        created_on > NOW() - $2::interval
    GROUP BY 
        c.type
    ORDER BY 
        amount DESC
    `,
    [district, validRange]
  )
  return {
    trends: trends.rows,
    categoryDistribution: categoryDistribution.rows,
  }
}
