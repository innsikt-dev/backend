import { Hono } from 'hono';
import { queryHistoricAnalysis } from './historic-analysis.js';
export const historic = new Hono();
historic.get('analysis', async (c) => {
    const data = await queryHistoricAnalysis();
    return c.json(data);
});
