import { describe, expect, test } from 'vitest'
import { app } from '../../../app.js'

describe('GET /dashboard/events', () => {
  test('returns events with required fields', async () => {
    const res = await app.request('/dashboard/events')
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data[0]).toMatchObject({
      id: expect.any(Number),
      municipality_name: expect.any(String),
      lat: expect.any(Number),
      lng: expect.any(Number),
      thread_id: expect.any(String),
    })
  })
})
