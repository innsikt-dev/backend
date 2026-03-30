import * as db from '../../../db/index.js'

export async function queryDashboardEvents() {
  const query = await db.query(
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
    FROM incidents i
    JOIN category c ON c.id = i.category_id
    JOIN municipality m ON m.id = i.municipality_id
    WHERE created_on::date = CURRENT_DATE AND is_active = true
    ORDER BY i.thread_id, i.created_on ASC
) sub
ORDER BY is_active DESC, created_on DESC;
`,
    []
  )

  return query.rows
}
