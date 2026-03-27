import cron from 'node-cron'
import { fetchPoliceLog } from '../api/police/index.js'
import { transformPoliceLog } from '../api/police/transform.js'

export function runSync() {
  cron.schedule('*/5 * * * *', async () => {
    console.log(`Starting sync`)
    const data = await fetchPoliceLog()
    console.log(`Finished sync ${data.data}`)
    await transformPoliceLog(data)
  })
}
