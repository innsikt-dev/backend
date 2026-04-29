import cron from 'node-cron'
import { fetchPoliceLog } from '../api/police/index.js'
import { transformPoliceLog } from '../api/police/transform.js'
import { notifyClients } from '../stream/index.js'

export async function runSync() {
  try {
    console.log('Starting sync')
    const data = await fetchPoliceLog()
    if (!data) return false
    await transformPoliceLog(data)
    notifyClients(data.data.length)
    return true
  } catch (e) {
    console.error('Sync failed:', e)
    return false
  }
}
