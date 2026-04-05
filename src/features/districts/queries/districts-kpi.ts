import * as db from '../../../db/index.js'
import type { DistrictKPI } from './types.js'

export async function queryDistrictsKpi(): Promise<DistrictKPI[]> {
  const query = await db.query(
    `
WITH base AS 
    (
SELECT 
    pd.district_name,
    i.thread_id,
    c.id,
    c.type as category,
    i.is_active,
    i.created_on
FROM 
    incidents i
JOIN 
    municipality m ON m.id = i.municipality_id 
JOIN 
    category c ON c.id = i.category_id  
JOIN 
    police_district pd ON pd.id = m.police_district_id
WHERE 
    created_on > now() - interval '30d'
    ),
total_incidents AS (
SELECT
    COUNT(distinct thread_id) as total_incidents,
    district_name
    from  base
    group by district_name
    order by total_incidents  desc
    ),
active_incidents AS (
SELECT 
    district_name,
    COUNT(distinct thread_id) as active
    FROM base
    where is_active = true
    AND created_on::date = current_date
    GROUP BY district_name
    ),
top_category AS (
SELECT
    district_name,
    category,
    COUNT(DISTINCT thread_id) AS category_count
FROM 
    base
GROUP BY district_name, category
    ),
top_category_ranked AS (
SELECT
    district_name,
    category,
    ROW_NUMBER() OVER (PARTITION BY district_name ORDER BY category_count DESC) AS rank
FROM 
    top_category
    )
SELECT 
    ti.district_name,
    ti.total_incidents::int,
    ai.active,
    tcr.category as top_category
FROM total_incidents ti
LEFT JOIN active_incidents ai ON ai.district_name = ti.district_name
LEFT JOIN top_category_ranked tcr ON tcr.district_name = ti.district_name AND tcr.rank = 1
    `,
    []
  )

  return query.rows
}
