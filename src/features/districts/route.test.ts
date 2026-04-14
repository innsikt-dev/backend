import { describe, expect, test } from 'vitest'
import { app } from '../../app.js'

describe('Districts', () => {
  test('GET /districts/kpi returns kpi data', async () => {
    const res = await app.request('/districts/kpi')
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    data.forEach((d: unknown) => {
      expect(d).toHaveProperty('district_name')
      expect(d).toHaveProperty('total_incidents')
      expect(d).toHaveProperty('active')
      expect(d).toHaveProperty('top_category')
    })
  })

  test('GET /districts/analytics returns expected data shape', async () => {
    const res = await app.request('/districts/analytics?period=30d')
    const data = await res.json()
    const categoryDistribution = data.categoryDistribution
    const trends = data.trends
    trends.forEach((d: unknown) => {
      expect(d).toHaveProperty('district_name')
      expect(d).toHaveProperty('amount')
      expect(d).toHaveProperty('date')
    })

    categoryDistribution.forEach((d: unknown) => {
      expect(d).toHaveProperty('category')
      expect(d).toHaveProperty('amount')
    })
  })
})
