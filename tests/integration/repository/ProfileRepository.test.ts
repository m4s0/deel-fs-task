import 'reflect-metadata'
import { container } from 'tsyringe'
import { DatabaseAdapter } from '../../../src/adapter/DatabaseAdapter'
import { ProfileRepository } from '../../../src/repository/ProfileRepository'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'
import { Job } from '../../../src/model/Job'

container.register('storage', { useValue: 'database.test.sqlite3' })
container.register('databaseLogging', { useValue: false })

const databaseAdapter = container.resolve(DatabaseAdapter)
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
      firstName: 'John',
      lastName: 'Lenon',
      profession: 'Musician',
      balance: 0,
      type: 'contractor',
    }),
    Profile.create({
      id: 3,
      firstName: 'Linus',
      lastName: 'Torvalds',
      profession: 'Programmer',
      balance: 0,
      type: 'contractor',
    }),

    Contract.create({
      id: 1,
      terms: 'bla bla bla',
      status: 'terminated',
      clientId: 1,
      contractorId: 2,
    }),
    Contract.create({
      id: 2,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 1,
      contractorId: 2,
    }),
    Contract.create({
      id: 3,
      terms: 'bla bla bla',
      status: 'terminated',
      clientId: 1,
      contractorId: 3,
    }),
    Contract.create({
      id: 4,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 1,
      contractorId: 3,
    }),

    Job.create({
      id: 1,
      description: 'work',
      price: 300,
      paid: true,
      paymentDate: '2021-01-01T00:00:00.000Z',
      contractId: 1,
    }),
    Job.create({
      id: 2,
      description: 'work',
      price: 150,
      paid: true,
      paymentDate: '2021-01-01T00:00:00.000Z',
      contractId: 2,
    }),
    Job.create({
      id: 3,
      description: 'work',
      price: 200,
      paid: true,
      paymentDate: '2021-01-01T00:00:00.000Z',
      contractId: 3,
    }),
    Job.create({
      id: 4,
      description: 'work',
      price: 50,
      paid: true,
      paymentDate: '2021-01-01T00:00:00.000Z',
      contractId: 4,
    }),
    Job.create({
      id: 5,
      description: 'work',
      price: 100,
      paid: true,
      paymentDate: '2021-01-01T00:00:00.000Z',
      contractId: 2,
    }),
  ])
}

describe('ProfileRepository', () => {
  beforeEach(async () => {
    await dbInit()
  })
  afterAll(async () => {
    await databaseAdapter.getConnection().close()
  })

  it('should get a list of all Profiles', async () => {
    const profiles = await profileRepository.findAllByType('')
    expect(profiles).toHaveLength(3)
  })

  it('should get a list of client Profiles', async () => {
    const profiles = await profileRepository.findAllByType('client')
    expect(profiles).toHaveLength(1)
  })

  it('should get a list of contractor Profiles', async () => {
    const profiles = await profileRepository.findAllByType('contractor')
    expect(profiles).toHaveLength(2)
  })

  it('should get a list clients the paid the most for jobs in the query time period', async () => {
    const profile = await profileRepository.findProfileThatEarnedTheMost(new Date('01-01-2000'), new Date('01-01-2024'))

    expect(profile).toStrictEqual({
      id: 2,
      profession: 'Musician',
      firstName: 'John',
      lastName: 'Lenon',
      earned: 300,
    })
  })
})
