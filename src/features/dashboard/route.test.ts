import { describe, expect, it, test } from 'vitest'
import { app } from '../../app.js'

describe('Dashboard', () => {
  test('GET / returns dashboard data', async () => {
    const res = await app.request('/dashboard/')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalCategories')
    expect(data).toHaveProperty('kpi')
    expect(data).toHaveProperty('events')
  })

  test('GET /threads/:id returns events', async () => {
    const res = await app.request('/dashboard/threads/26jmtx')
    expect(res.status).toBe(200)
    const data = await res.json()
    const firstThread = data[0]
    expect(firstThread).toHaveProperty('thread_id')
    expect(firstThread).toHaveProperty('municipality_name')
    expect(firstThread).toHaveProperty('lat')
    expect(firstThread).toHaveProperty('lng')
    expect(firstThread).toHaveProperty('type')
    expect(firstThread).toHaveProperty('is_active')
  })

  test('GET /threads/:id returns empty array for invalid id', async () => {
    const res = await app.request('/dashboard/threads/fake-id')
    const data: [] = await res.json()
    expect(data.length).toBe(0)
  })
})
