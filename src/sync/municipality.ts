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
    let lat = null
    let lng = null

    try {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(m.municipality_name)}&countrycodes=no&format=json&limit=1`,
        { headers: { 'User-Agent': 'innsikt.dev' } }
      )
      if (geo.ok && geo.headers.get('content-type')?.includes('json')) {
        const [result] = await geo.json()
        lat = result?.lat ?? null
        lng = result?.lon ?? null
      }
    } catch (e) {
      console.log(`Geocoding failed for ${m.municipality_name}`)
    }

    await db.query(
      `INSERT INTO municipality(municipality_name, police_district_id, lat, lng)
       VALUES($1, $2, $3, $4)
       ON CONFLICT(municipality_name) DO NOTHING`,
      [m.municipality_name, districtMap.get(m.district_name), lat, lng]
    )

    await new Promise((resolve) => setTimeout(resolve, 1100))
  }
}
