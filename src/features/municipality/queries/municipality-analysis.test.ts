import { describe, expect, test } from 'vitest'
import { app } from '../../../app.js'

describe('GET /municipality/analysis/:id', () => {
  test('returns empty arrays for unknown municipality', async () => {
    const res = await app.request('/municipality/analysis/OsloZ')
    const data = await res.json()
    expect(data).toEqual({
      incidentsOverTime: [],
      categoryDistribution: [],
      events: [],
    })
  })

  test('returns analysis data for valid municipality', async () => {
    const res = await app.request('/municipality/analysis/Oslo')
    const data = await res.json()
    expect(data).toMatchObject({
      incidentsOverTime: expect.any(Array),
      categoryDistribution: expect.any(Array),
      events: expect.any(Array),
    })
  })
})
