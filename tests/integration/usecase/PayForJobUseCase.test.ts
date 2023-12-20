import 'reflect-metadata'
import { container } from 'tsyringe'
import { DatabaseAdapter } from '../../../src/adapter/DatabaseAdapter'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'
import { PayForJobUseCase } from '../../../src/usecase/PayForJobUseCase'
import { Job } from '../../../src/model/Job'
import { ProfileRepository } from '../../../src/repository/ProfileRepository'
import { JobRepository } from '../../../src/repository/JobRepository'

container.register('storage', { useValue: 'database.test.sqlite3' })
container.register('databaseLogging', { useValue: false })

const databaseAdapter = container.resolve(DatabaseAdapter)
const payForJobUseCase = container.resolve(PayForJobUseCase)
const profileRepository = container.resolve(ProfileRepository)
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
      balance: 1000,
      type: 'client',
    }),
    Profile.create({
      id: 2,
      firstName: 'Linus',
      lastName: 'Torvalds',
      profession: 'Programmer',
      balance: 0,
      type: 'contractor',
    }),
    Profile.create({
      id: 3,
      firstName: 'John',
      lastName: 'Snow',
      profession: 'Knows nothing',
      balance: 50,
      type: 'client',
    }),
    Contract.create({
      id: 1,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 1,
      contractorId: 2,
    }),
    Contract.create({
      id: 2,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 3,
      contractorId: 2,
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
      price: 200,
      contractId: 2,
    }),
  ])
}

describe('PayForJobUseCase', () => {
  beforeEach(async () => {
    await dbInit()
  })
  afterAll(async () => {
    await databaseAdapter.getConnection().close()
  })

  it('Client should pay for a Job', async () => {
    let profile1 = await profileRepository.findOneById(1)
    let profile2 = await profileRepository.findOneById(2)

    expect(profile1!.balance).toBe(1000)
    expect(profile2!.balance).toBe(0)

    await payForJobUseCase.execute(1, profile1!)

    profile1 = await profileRepository.findOneById(1)
    profile2 = await profileRepository.findOneById(2)

    expect(profile1!.balance).toBe(800)
    expect(profile2!.balance).toBe(200)

    const job1 = await jobRepository.findOneActiveById(1)

    expect(job1!.paid).toBeTruthy()
  })

  it('Client should not pay for a job because of the insufficient balance', async () => {
    let profile2 = await profileRepository.findOneById(2)
    let profile3 = await profileRepository.findOneById(3)

    expect(profile2!.balance).toBe(0)
    expect(profile3!.balance).toBe(50)

    await expect(payForJobUseCase.execute(2, profile3!)).rejects.toThrow('your balance is insufficient')

    profile2 = await profileRepository.findOneById(2)
    profile3 = await profileRepository.findOneById(3)

    expect(profile2!.balance).toBe(0)
    expect(profile3!.balance).toBe(50)

    const job2 = await jobRepository.findOneActiveById(2)

    expect(job2!.paid).toBeFalsy()
  })
})
