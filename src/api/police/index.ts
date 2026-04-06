import { PoliceLogResponseSchema } from './schema.js'

export async function fetchPoliceLog() {
  const res = await fetch('https://api.politiet.no/politiloggen/v1/messages')
  if (!res.ok) {
    console.error(`Politiloggen responded with ${res.status}`)
    return null
  }
  const json = await res.json()
  const parsed = PoliceLogResponseSchema.parse(json)
  return parsed
}
