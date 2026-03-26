import * as db from '../db/index.js'
import type { Municipality } from './types.js'

export async function syncMunicipality(data: Municipality[]): Promise<void> {
  const districts = await db.query(
    'SELECT id, district_name FROM police_district',
    []
  )
  const districtMap = new Map(
    districts.rows.map((d) => [d.district_name, d.id])
  )

  for (const m of data) {
    await db.query(
      ` INSERT INTO municipality(municipality_name, police_district_id)
        VALUES($1, $2)
        ON CONFLICT(municipality_name) DO NOTHING`,
      [m.municipality_name, districtMap.get(m.district_name)]
    )
  }
}
