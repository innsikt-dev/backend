import * as db from '../../../db/index.js'
export async function queryDashboardThread(threadId: string) {
  const query = await db.query(
    `
       SELECT
      i.thread_id,
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
    WHERE created_on::date = CURRENT_DATE
    AND LOWER(thread_id) = LOWER($1)
    ORDER BY i.thread_id, i.created_on ASC


        `,
    [threadId]
  )

  return query.rows
}
