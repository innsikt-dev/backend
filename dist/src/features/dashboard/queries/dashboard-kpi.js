import * as db from '../../../db/index.js';
export async function queryDashboardKpi() {
    const totalIncidents = await db.query(`SELECT COUNT(*) AS total_incidents FROM mv_dashboard_base
     WHERE created_on::date = CURRENT_DATE;`, []);
    const mostActiveDistrict = await db.query(`SELECT municipality_name, COUNT(*) AS most_active_district
     FROM mv_dashboard_base
     WHERE created_on::date = CURRENT_DATE
     GROUP BY municipality_name
     ORDER BY COUNT(*) DESC
     LIMIT 1;`, []);
    const mostCommonCategory = await db.query(`SELECT type AS category, COUNT(type)
     FROM mv_dashboard_base
     WHERE created_on::date = CURRENT_DATE
     GROUP BY category
     ORDER BY COUNT(*) DESC
     LIMIT 1;`, []);
    const activeIncidents = await db.query(`SELECT COUNT(*) AS active_incidents
     FROM mv_dashboard_base
     WHERE is_active = true AND created_on::date = CURRENT_DATE;`, []);
    return {
        totalIncidents: Number(totalIncidents.rows[0]?.total_incidents ?? 0),
        mostActiveDistrict: mostActiveDistrict.rows[0]?.municipality_name ?? null,
        mostCommonCategory: mostCommonCategory.rows[0]?.category ?? null,
        activeIncidents: Number(activeIncidents.rows[0]?.active_incidents ?? 0),
    };
}
