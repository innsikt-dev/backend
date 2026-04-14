import { describe, expect, it, test, vi } from 'vitest'
import { app } from '../../app.js'

describe('Explore', () => {
  test('GET /explore/municipalities/names returns array', async () => {
    const res = await app.request('/explore/municipalities/names')
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('GET /explore/municipalities returns municipality data', async () => {
    const res = await app.request(
      '/explore/municipalities?municipality1=Oslo&municipality2=Bergen&period=365d'
    )
    const data = await res.json()
    const m1 = data.municipalityOne
    const m2 = data.municipalityTwo
    expect(m1).toHaveProperty('municipality_name')
    expect(m1).toHaveProperty('district_name')
    expect(m1).toHaveProperty('total_incidents')

    expect(m2).toHaveProperty('municipality_name')
    expect(m2).toHaveProperty('district_name')
    expect(m2).toHaveProperty('total_incidents')
  })

  test('GET /explore/municipalities/analytics returns expected data shape', async () => {
    const res = await app.request(
      '/explore/municipalities/analytics?period=365d'
    )
    const data = await res.json()
    expect(data).toHaveProperty('keywordIncidents')
    expect(data).toHaveProperty('incidentsOverTime')
  })
})
