import { describe, expect, test } from 'vitest'
import { app } from '../../app.js'

describe('GET /historic/analysis', () => {
  test('falls back to default period for invalid input', async () => {
    const res = await app.request('/historic/analysis?period=invalid')
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toHaveProperty('heatMap')
  })

  test('returns analysis data for valid period', async () => {
    const res = await app.request('/historic/analysis?period=7d')
    const data = await res.json()
    expect(data).toMatchObject({
      heatMap: expect.any(Array),
      trends: expect.any(Array),
      topMunicipalities: expect.any(Array),
      categoryDistribution: expect.any(Array),
    })
  })
})
