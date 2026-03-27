import * as db from '../db/index.js';
export async function syncDistrict(data) {
    for (const district of data) {
        await db.query(`
        INSERT INTO police_district(district_name)
        VALUES($1)
        ON CONFLICT(district_name) DO NOTHING
        RETURNING ID
        `, [district]);
    }
}
