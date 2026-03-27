import * as db from '../db/index.js';
export async function syncMunicipality(data) {
    const districts = await db.query('SELECT id, district_name FROM police_district', []);
    const districtMap = new Map(districts.rows.map((d) => [d.district_name, d.id]));
    for (const m of data) {
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(m.municipality_name)}&countrycodes=no&format=json&limit=1`, { headers: { 'User-Agent': 'innsikt.dev' } });
        const [result] = await geo.json();
        await db.query(`INSERT INTO municipality(municipality_name, police_district_id, lat, lng)
       VALUES($1, $2, $3, $4)
       ON CONFLICT(municipality_name) DO NOTHING`, [
            m.municipality_name,
            districtMap.get(m.district_name),
            result?.lat ?? null,
            result?.lon ?? null,
        ]);
        await new Promise((resolve) => setTimeout(resolve, 1100));
    }
}
