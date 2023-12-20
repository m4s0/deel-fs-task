import 'reflect-metadata'
import { container } from 'tsyringe'
import { DatabaseAdapter } from '../../../src/adapter/DatabaseAdapter'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'
import { Job } from '../../../src/model/Job'
import { JobRepository } from '../../../src/repository/JobRepository'

container.register('storage', { useValue: 'database.test.sqlite3' })
container.register('databaseLogging', { useValue: false })

const databaseAdapter = container.resolve(DatabaseAdapter)
const jobRepository = container.resolve(JobRepository)

const dbInit = async () => {
  await databaseAdapter.getConnection().drop()
  await databaseAdapter.getConnection().sync()

  await Profile.sync({ force: true })
  await Contract.sync({ force: true })
  await Job.sync({ force: true })

  await Promise.all([
    Profile.create({
      id: 1,
      firstName: 'Harry',
      lastName: 'Potter',
      profession: 'Wizard',
      balance: 1150,
      type: 'client',
    }),
    Profile.create({
      id: 2,
      firstName: 'Mr',
      lastName: 'Robot',
      profession: 'Hacker',
      balance: 231.11,
      type: 'client',
    }),
    Profile.create({
      id: 3,
      firstName: 'John',
      lastName: 'Lenon',
      profession: 'Musician',
      balance: 64,
      type: 'contractor',
    }),
    Profile.create({
      id: 4,
      firstName: 'Linus',
      lastName: 'Torvalds',
      profession: 'Programmer',
      balance: 1214,
      type: 'contractor',
    }),
    Contract.create({
      id: 1,
      terms: 'bla bla bla',
      status: 'terminated',
      clientId: 1,
      contractorId: 4,
    }),
    Contract.create({
      id: 2,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 1,
      contractorId: 3,
    }),
    Contract.create({
      id: 3,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 2,
      contractorId: 4,
    }),
    Contract.create({
      id: 4,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 2,
      contractorId: 3,
    }),
    Job.create({
      id: 1,
      description: 'work',
      price: 200,
      contractId: 1,
    }),
    Job.create({
      id: 2,
      description: 'work',
      price: 201,
      contractId: 2,
    }),
    Job.create({
      id: 3,
      description: 'work',
      price: 202,
      contractId: 3,
    }),
    Job.create({
      id: 4,
      description: 'work',
      price: 200,
      contractId: 4,
    }),
    Job.create({
      id: 5,
      description: 'work',
      price: 200,
      paid: true,
      paymentDate: '2020-08-15T19:11:26.737Z',
      contractId: 2,
    }),
  ])
}

describe('JobRepository', () => {
  beforeEach(async () => {
    await dbInit()
  })
  afterAll(async () => {
    await databaseAdapter.getConnection().close()
  })

  it('should get a list clients the paid the most for jobs in the query time period', async () => {
    const bestClients = await jobRepository.findJobsThatPayTheMost(new Date('01-01-2000'), new Date('01-01-2024'), 10)
    expect(bestClients).toHaveLength(1)
    expect(bestClients).toStrictEqual([
      {
        contract: {
          client: {
            firstName: 'Harry',
            id: 1,
            lastName: 'Potter',
          },
          id: 2,
        },
        paid: 200,
      },
    ])
  })

  it('should get a list of unpaid Jobs by profileId', async () => {
    const jobs = await jobRepository.findUnpaidJobsByProfileId(1)
    expect(jobs).toHaveLength(1)

    expect(jobs[0]!.id).toBe(2)
    expect(jobs[0]!.description).toBe('work')
    expect(jobs[0]!.price).toBe(201)
    expect(jobs[0]!.paid).toBeFalsy()
    expect(jobs[0]!.contractId).toBe(2)
  })
})
