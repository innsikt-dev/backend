import * as db from '../../../db/index.js'
import { isValidRange } from '../../../lib/config/is-valid-range.js'
import type { ExploreAnalyticsQueryResult, Payload } from './types.js'

export async function queryAnalytics(
  payload: Payload
): Promise<ExploreAnalyticsQueryResult> {
  const validRange = isValidRange(payload.period ?? '')
  const perCapita = payload.perCapita === 'true' ? true : null

  const keywordIncidents = await db.query(
    `
    SELECT
        m.municipality_name,
        c.type as category,
        CASE
            WHEN $4::boolean IS NOT NULL THEN ROUND(COUNT(DISTINCT i.thread_id)::numeric / pop.population * 1000, 3)::float
            ELSE COUNT(DISTINCT i.thread_id)::float
        END as amount
    FROM incidents i
    JOIN category c ON c.id = i.category_id
    JOIN municipality m ON m.id = i.municipality_id
    LEFT JOIN population pop ON pop.municipality_name = m.municipality_name
    WHERE LOWER(m.municipality_name) IN (LOWER($1), LOWER($2))
    AND created_on > NOW() - $3::interval
    GROUP BY m.municipality_name, c.type, pop.population
    ORDER BY m.municipality_name
    `,
    [payload.id1, payload.id2, validRange, perCapita]
  )

  const incidentsOverTime = await db.query(
    `
    SELECT
        m.municipality_name,
        i.created_on::date as date,
        CASE
            WHEN $4::boolean IS NOT NULL THEN ROUND(COUNT(DISTINCT i.thread_id)::numeric / pop.population * 1000, 3)::float
            ELSE COUNT(DISTINCT i.thread_id)::float
        END as amount
    FROM incidents i
    JOIN municipality m ON m.id = i.municipality_id
    LEFT JOIN population pop ON pop.municipality_name = m.municipality_name
    WHERE LOWER(m.municipality_name) IN (LOWER($1), LOWER($2))
    AND created_on > NOW() - $3::interval
    GROUP BY m.municipality_name, i.created_on::date, pop.population
    ORDER BY date, m.municipality_name ASC
    `,
    [payload.id1, payload.id2, validRange, perCapita]
  )

  return {
    keywordIncidents: keywordIncidents.rows,
    incidentsOverTime: incidentsOverTime.rows,
  }
}
