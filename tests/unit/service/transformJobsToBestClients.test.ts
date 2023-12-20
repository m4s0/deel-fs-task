import { Job } from '../../../src/model/Job'
import { Sequelize } from 'sequelize-typescript'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'
import { transformJobsToBestClients } from '../../../src/service/transformJobsToBestClients'

describe('transformJobsToBestClients', () => {
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

  it('should return best client from a list of jobs', () => {
    const profile1 = new Profile()
    profile1.id = 1
    profile1.firstName = 'foo'
    profile1.lastName = 'bar'
    const profile2 = new Profile()
    profile2.id = 3
    profile2.firstName = 'thor'
    profile2.lastName = 'god'
    const profile3 = new Profile()
    profile3.id = 3
    profile3.firstName = 'giulio'
    profile3.lastName = 'cesare'

    const contract1 = new Contract()
    contract1.id = 1
    contract1.client = profile1
    const contract2 = new Contract()
    contract2.id = 2
    contract2.client = profile2
    const contract3 = new Contract()
    contract3.id = 3
    contract3.client = profile3

    const job1 = new Job()
    job1.description = 'Job 1'
    job1.price = 100
    job1.paid = false
    job1.paymentDate = new Date()
    job1.contract = contract1

    const job2 = new Job()
    job2.description = 'Job 2'
    job2.price = 200
    job2.paid = true
    job2.paymentDate = new Date()
    job2.contract = contract2

    const job3 = new Job()
    job3.description = 'Job 3'
    job3.price = 300
    job3.paid = true
    job3.paymentDate = new Date()
    job3.contract = contract3

    const jobs: Job[] = []
    jobs.push(job1)
    jobs.push(job2)
    jobs.push(job3)

    const bestClients = transformJobsToBestClients(jobs)
    expect(bestClients).toStrictEqual([
      {
        fullName: 'foo bar',
        id: 1,
        paid: false,
      },
      {
        fullName: 'thor god',
        id: 3,
        paid: true,
      },
      {
        fullName: 'giulio cesare',
        id: 3,
        paid: true,
      },
    ])
  })
})
