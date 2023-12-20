import { Job } from '../model/Job'

export function calculateTotalPriceFromJobs(jobsToPay: Job[]): number {
  return jobsToPay.map((job: Job): number => job.price).reduce((a: number, b: number): number => a + b, 0)
}
