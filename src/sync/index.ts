import cron from 'node-cron'
import { fetchPoliceLog } from '../api/police/index.js'
import { transformPoliceLog } from '../api/police/transform.js'
import { notifyClients } from '../stream/index.js'

export function runSync() {
  cron.schedule('* * * * *', async () => {
    console.log(`Starting sync`)
    const data = await fetchPoliceLog()
    console.log(
      `Finished sync for: ${data.data.forEach((D) => console.log(D.threadId))}`
    )
    await transformPoliceLog(data)
    notifyClients(data.data.length)
  })
}
