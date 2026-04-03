import * as db from '../../../db/index.js'
import type { Payload } from './types.js'

export async function queryMunicipalities(payload: Payload) {
  const query = await db.query(
    `
  WITH base AS (
    SELECT DISTINCT ON (i.thread_id)
        m.municipality_name,
        pd.district_name,
        c.type AS category,
        i.thread_id,
        i.created_on
  FROM 
      incidents i
  JOIN category c 
  ON 
    c.id = i.category_id
  JOIN municipality m 
  ON 
    m.id = i.municipality_id
  JOIN police_district pd 
  ON 
    pd.id = m.police_district_id
  WHERE 
    created_on > NOW () - $3::interval
  ORDER BY 
    i.thread_id, i.created_on ASC
),
category_ranked AS (
  SELECT
    municipality_name,
    category,
    COUNT(thread_id) AS amount,
    ROW_NUMBER() OVER (PARTITION BY municipality_name ORDER BY COUNT(thread_id) DESC) AS rank
  FROM 
    base
  GROUP BY 
    municipality_name, category
),
top_category AS (
  SELECT 
    municipality_name, 
    category AS most_common
  FROM 
    category_ranked
  WHERE 
    rank = 1
),
daily_avg AS (
  SELECT
    municipality_name,
    ROUND(AVG(daily_count), 1) AS avg_per_day
  FROM (
    SELECT
      municipality_name,
      created_on::date AS date,
      COUNT(thread_id) AS daily_count
    FROM 
      base
    GROUP BY 
      municipality_name, date
  ) daily
  GROUP BY 
    municipality_name
)
SELECT
  b.municipality_name,
  b.district_name,
  COUNT(b.thread_id) AS total_incidents,
  tc.most_common AS most_common_category,
  da.avg_per_day
FROM 
  base b
JOIN top_category tc 
  ON 
    tc.municipality_name = b.municipality_name
JOIN daily_avg da 
  ON 
    da.municipality_name = b.municipality_name
WHERE 
  LOWER(b.municipality_name) IN (LOWER($1), LOWER($2))
GROUP 
  BY b.municipality_name, b.district_name, tc.most_common, da.avg_per_day;
    `,
    [payload.id1, payload.id2, payload.period]
  )
  const findMunicipality = (name: string) =>
    query.rows.find(
      (r) => r.municipality_name.toLowerCase() === name.toLowerCase()
    ) ?? []

  return {
    municipalityOne: findMunicipality(payload.id1),
    municipalityTwo: findMunicipality(payload.id2),
  }
}
