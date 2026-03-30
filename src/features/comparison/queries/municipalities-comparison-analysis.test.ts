import { describe, expect, test } from 'vitest'
import { app } from '../../../app.js'

describe('GET /comparison/municipalities/analysis', () => {
  test('returns analysis data for two municipalities', async () => {
    const res = await app.request(
      '/comparison/municipalities/analysis?municipality1=Oslo&municipality2=Bergen&period=7d'
    )
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data).toMatchObject({
      keywordIncidents: expect.any(Array),
      incidentsOverTime: expect.any(Array),
    })
  })

  test('returns empty arrays for unknown municipalities', async () => {
    const res = await app.request(
      '/comparison/municipalities/analysis?municipality1=XYZ&municipality2=ABC'
    )
    const data = await res.json()
    expect(data).toEqual({
      keywordIncidents: [],
      incidentsOverTime: [],
    })
  })
})
