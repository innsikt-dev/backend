import cron from 'node-cron'
import { fetchPoliceLog } from '../api/police/index.js'
import { transformPoliceLog } from '../api/police/transform.js'
import { notifyClients } from '../stream/index.js'

export function runSync() {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Starting sync')
      const data = await fetchPoliceLog()
      if (!data) return
      await transformPoliceLog(data)
      notifyClients(data.data.length)
    } catch (e) {
      console.error('Sync failed:', e)
    }
  })
}
