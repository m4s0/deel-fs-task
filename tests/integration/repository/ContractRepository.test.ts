import 'reflect-metadata'
import { container } from 'tsyringe'
import { DatabaseAdapter } from '../../../src/adapter/DatabaseAdapter'
import { Profile } from '../../../src/model/Profile'
import { Contract } from '../../../src/model/Contract'
import { ContractRepository } from '../../../src/repository/ContractRepository'

container.register('storage', { useValue: 'database.test.sqlite3' })
container.register('databaseLogging', { useValue: false })

const databaseAdapter = container.resolve(DatabaseAdapter)
const contractRepository = container.resolve(ContractRepository)

const dbInit = async () => {
  await databaseAdapter.getConnection().drop()
  await databaseAdapter.getConnection().sync()

  await Profile.sync({ force: true })
  await Contract.sync({ force: true })

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
      firstName: 'John',
      lastName: 'Lenon',
      profession: 'Musician',
      balance: 64,
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
      status: 'in_progress',
      clientId: 2,
      contractorId: 1,
    }),
    Contract.create({
      id: 4,
      terms: 'bla bla bla',
      status: 'in_progress',
      clientId: 2,
      contractorId: 1,
    }),
  ])
}

describe('ContractRepository', () => {
  beforeEach(async () => {
    await dbInit()
  })
  afterAll(async () => {
    await databaseAdapter.getConnection().close()
  })

  it('should get a list of all Contracts owned by profileId', async () => {
    const contract = await contractRepository.findOneByIdAndProfileId(1, 1)
    expect(contract).not.toBeNull()
    expect(contract!.id).toBe(1)
    expect(contract!.clientId).toBe(1)
    expect(contract!.contractorId).toBe(2)
    expect(contract!.status).toBe('terminated')
    expect(contract!.terms).toBe('bla bla bla')
  })
})
