import * as db from '../db/index.js'
import type { Incident } from './types.js'

export async function syncIncident(data: Incident[]): Promise<void> {
  const municipalities = await db.query(
    'SELECT id, municipality_name FROM municipality',
    []
  )
  const categories = await db.query('SELECT id, type FROM category', [])

  const municipalityMap = new Map(
    municipalities.rows.map((m) => [m.municipality_name, m.id])
  )
  const categoryMap = new Map(categories.rows.map((c) => [c.type, c.id]))

  for (const incident of data) {
    await db.query(
      `INSERT INTO incidents(id, thread_id, municipality_id, category_id, area, is_active, text, created_on, updated_on, is_edited)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT(id) DO UPDATE SET
      is_active = EXCLUDED.is_active,
      text = EXCLUDED.text,
      updated_on = EXCLUDED.updated_on,
      is_edited = EXCLUDED.is_edited`,
      [
        incident.id,
        incident.thread_id,
        municipalityMap.get(incident.municipality_name),
        categoryMap.get(incident.category_name),
        incident.area,
        incident.is_active,
        incident.text,
        incident.created_on,
        incident.updated_on,
        incident.is_edited,
      ]
    )
  }
}
