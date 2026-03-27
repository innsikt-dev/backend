import { syncDistrict } from '../../sync/district.js';
import { syncMunicipality } from '../../sync/municipality.js';
import { syncCategory } from '../../sync/category.js';
import { syncIncident } from '../../sync/incidents.js';
import * as db from '../../db/index.js';
export async function transformPoliceLog(data) {
    const district = data.data.map((d) => d.district);
    const municipality = data.data.map((d) => ({
        municipality_name: d.municipality,
        district_name: d.district,
    }));
    const category = data.data.map((d) => d.category);
    const incident = data.data.map((d) => ({
        id: d.id,
        thread_id: d.threadId,
        municipality_name: d.municipality,
        category_name: d.category,
        area: d.area,
        is_active: d.isActive,
        text: d.text,
        created_on: d.createdOn,
        updated_on: d.updatedOn,
        is_edited: d.isEdited,
    }));
    await syncDistrict(district);
    await syncMunicipality(municipality);
    await syncCategory(category);
    await syncIncident(incident);
    await db.query('REFRESH MATERIALIZED VIEW mv_dashboard_base', []);
}
