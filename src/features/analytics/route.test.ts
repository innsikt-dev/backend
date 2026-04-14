import { describe, expect, test } from 'vitest'
import { app } from '../../app.js'

describe('Analytics', () => {
  test('GET /analytics returns 200', async () => {
    const res = await app.request('/analytics')
    expect(res.status).toBe(200)
  })

  test('GET /analytics returns expected data shape', async () => {
    const res = await app.request('/analytics')
    const data = await res.json()
    expect(data).toHaveProperty('heatMap')
    expect(data).toHaveProperty('trends')
    expect(data).toHaveProperty('topMunicipalities')
    expect(data).toHaveProperty('categoryDistribution')
  })

  test('GET /analytics accepts period param', async () => {
    const res = await app.request('/analytics?period=30d')
    expect(res.status).toBe(200)
  })
})
