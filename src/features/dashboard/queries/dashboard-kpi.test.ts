import { describe, expect, test } from 'vitest'
import { app } from '../../../app.js'

describe('GET /dashboard/kpi', () => {
  test('returns kpi with required fields', async () => {
    const res = await app.request('/dashboard/kpi')
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toMatchObject({
      totalIncidents: expect.any(Number),
      mostActiveDistrict: expect.any(String),
      mostCommonCategory: expect.any(String),
      activeIncidents: expect.any(Number),
    })
  })
})
