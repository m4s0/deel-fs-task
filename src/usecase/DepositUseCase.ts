import { injectable } from 'tsyringe'
import { JobRepository } from '../repository/JobRepository'
import { LogicException } from '../exception/LogicException'
import { ProfileRepository } from '../repository/ProfileRepository'
import { DatabaseAdapter } from '../adapter/DatabaseAdapter'
import { Sequelize } from 'sequelize-typescript'
import { Profile } from '../model/Profile'
import { calculateTotalPriceFromJobs } from '../service/calculateTotalPriceFromJobs'

@injectable()
export class DepositUseCase {
  private sequelize: Sequelize

  constructor(
    private readonly jobRepository: JobRepository,
    private readonly profileRepository: ProfileRepository,
    databaseAdapter: DatabaseAdapter,
  ) {
    this.sequelize = databaseAdapter.getConnection()
  }

  async execute(amount: number, profileId: number): Promise<number> {
    if (!amount) {
      throw new LogicException('amount is required')
    }

    const profile = await this.profileRepository.findOneById(profileId)
    if (!profile) {
      throw new LogicException('profile not found')
    }

    if (profile.type !== 'client') {
      throw new LogicException('you cannot deposit')
    }

    const transaction = await this.sequelize.transaction()

    try {
      const jobs = await this.jobRepository.findAllActiveJobsToPayByProfileId(profile.id, transaction)
      const totalPrice = calculateTotalPriceFromJobs(jobs)

      if (totalPrice == null) {
        throw new LogicException('you have no unpaid job')
      }

      const maxDeposit = totalPrice * 0.25
      if (amount > maxDeposit) {
        throw new LogicException(`you cannot deposit more than ${maxDeposit}`)
      }

      const newBalance = profile.balance + amount
      await Profile.update(
        { balance: newBalance },
        {
          where: { id: profile.id },
          transaction,
        },
      )

      await transaction.commit()

      return newBalance
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
