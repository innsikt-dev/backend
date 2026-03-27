import * as db from '../db/index.js'
import { GEOCODE_API_KEY } from '../lib/env.js'
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
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(m.municipality_name)}&filter=countrycode:no&limit=1&apiKey=${GEOCODE_API_KEY}`
      )
      if (geo.ok) {
        const data = await geo.json()
        const result = data.features?.[0]?.properties
        lat = result?.lat ?? null
        lng = result?.lon ?? null
      }
    } catch (e) {
      console.log(`Geocoding failed for ${m.municipality_name}`)
    }

    await db.query(
      `INSERT INTO municipality(municipality_name, police_district_id, lat, lng)
VALUES($1, $2, $3, $4)
ON CONFLICT(municipality_name) DO UPDATE SET
  lat = CASE WHEN municipality.lat IS NULL THEN EXCLUDED.lat ELSE municipality.lat END,
  lng = CASE WHEN municipality.lng IS NULL THEN EXCLUDED.lng ELSE municipality.lng END`,
      [m.municipality_name, districtMap.get(m.district_name), lat, lng]
    )

    await new Promise((resolve) => setTimeout(resolve, 1100))
  }
}
