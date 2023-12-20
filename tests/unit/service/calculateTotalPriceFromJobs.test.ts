import { Job } from '../../../src/model/Job'
import { calculateTotalPriceFromJobs } from '../../../src/service/calculateTotalPriceFromJobs'
import { Sequelize } from 'sequelize-typescript'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'

describe('calculateTotalPriceFromJobs', () => {
  let sequelize: Sequelize

  beforeAll(async () => {
    sequelize = new Sequelize({
      database: '__',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      models: [Profile, Contract, Job],
    })
  })
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  it('should return the sum of job prices', () => {
    const job1 = new Job()
    job1.description = 'Job 1'
    job1.price = 100
    job1.paid = false
    job1.paymentDate = new Date()
    job1.contractId = 1

    const job2 = new Job()
    job2.description = 'Job 2'
    job2.price = 200
    job2.paid = false
    job2.paymentDate = new Date()
    job2.contractId = 2

    const job3 = new Job()
    job3.description = 'Job 3'
    job3.price = 300
    job3.paid = false
    job3.paymentDate = new Date()
    job3.contractId = 3

    const jobs: Job[] = []
    jobs.push(job1)
    jobs.push(job2)
    jobs.push(job3)

    const totalPrice = calculateTotalPriceFromJobs(jobs)
    expect(totalPrice).toBe(600)
  })
  it('should return 0 if no jobs', () => {
    const jobs: Job[] = []
    const totalPrice = calculateTotalPriceFromJobs(jobs)
    expect(totalPrice).toBe(0)
  })
})
