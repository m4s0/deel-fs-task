import { Job } from '../model/Job'
import { BestClient } from '../types'

export function transformJobsToBestClients(jobs: Job[]): BestClient[] {
  return jobs.map(
    (job: Job): BestClient => ({
      id: job.contract.client.id,
      paid: job.paid,
      fullName: `${job.contract.client.firstName} ${job.contract.client.lastName}`,
    }),
  )
}
