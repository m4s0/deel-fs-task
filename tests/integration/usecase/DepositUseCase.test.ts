import 'reflect-metadata'
import { container } from 'tsyringe'
import { DatabaseAdapter } from '../../../src/adapter/DatabaseAdapter'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'
import { Job } from '../../../src/model/Job'
import { ProfileRepository } from '../../../src/repository/ProfileRepository'
import { DepositUseCase } from '../../../src/usecase/DepositUseCase'

container.register('storage', { useValue: 'database.test.sqlite3' })
container.register('databaseLogging', { useValue: false })

const databaseAdapter = container.resolve(DatabaseAdapter)
const depositUseCase = container.resolve(DepositUseCase)
const profileRepository = container.resolve(ProfileRepository)

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
      balance: 0,
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
      firstName: 'Alan',
      lastName: 'Turing',
      profession: 'Programmer',
      balance: 0,
      type: 'contractor',
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
      clientId: 1,
      contractorId: 3,
    }),
    Job.create({
      id: 1,
      description: 'work',
      price: 100,
      contractId: 1,
      paid: true,
    }),
    Job.create({
      id: 2,
      description: 'work',
      price: 200,
      contractId: 2,
      paid: true,
    }),
  ])
}

describe('DepositUseCase', () => {
  beforeEach(async () => {
    await dbInit()
  })
  afterAll(async () => {
    await databaseAdapter.getConnection().close()
  })

  it('Client must deposit the money in its balance', async () => {
    let profile1 = await profileRepository.findOneById(1)

    expect(profile1!.balance).toBe(0)

    await depositUseCase.execute(75, 1)

    profile1 = await profileRepository.findOneById(1)

    expect(profile1!.balance).toBe(75)
  })

  it('Client should not deposit money in its balance because the amount is greater than 25% of the total of his works to be paid for', async () => {
    let profile1 = await profileRepository.findOneById(1)

    expect(profile1!.balance).toBe(0)

    await expect(depositUseCase.execute(76, 1)).rejects.toThrow('you cannot deposit more than 75')

    profile1 = await profileRepository.findOneById(1)

    expect(profile1!.balance).toBe(0)
  })
})
