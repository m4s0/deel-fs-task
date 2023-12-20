import { Profile } from '../model/Profile'
import { Job } from '../model/Job'
import { LogicException } from '../exception/LogicException'
import { RuntimeException } from '../exception/RuntimeException'
import { injectable } from 'tsyringe'
import { JobRepository } from '../repository/JobRepository'
import { ProfileRepository } from '../repository/ProfileRepository'
import { DatabaseAdapter } from '../adapter/DatabaseAdapter'
import { Sequelize } from 'sequelize-typescript'

@injectable()
export class PayForJobUseCase {
  private sequelize: Sequelize

  constructor(
    private readonly jobRepository: JobRepository,
    private readonly profileRepository: ProfileRepository,
    databaseAdapter: DatabaseAdapter,
  ) {
    this.sequelize = databaseAdapter.getConnection()
  }

  async execute(jobId: number, profile: Profile): Promise<void> {
    if (profile.type !== 'client') {
      throw new LogicException('you cannot make any payment!')
    }

    const job = await this.jobRepository.findOneActiveById(jobId)

    if (!job) {
      throw new LogicException('job not found')
    }
    if (job.paid) {
      throw new LogicException('job already paid')
    }

    const balance = profile.balance
    const jobPrice = job.price
    if (balance < jobPrice) {
      throw new LogicException('your balance is insufficient')
    }

    const contractorProfile = await this.profileRepository.findOneById(Number(job.contract.contractorId))
    if (!contractorProfile) {
      throw new LogicException('contractor not found')
    }

    const transaction = await this.sequelize.transaction()

    try {
      await Profile.update(
        { balance: balance - jobPrice },
        {
          where: { id: profile.id },
          transaction,
        },
      )

      await Profile.update(
        { balance: contractorProfile.balance + jobPrice },
        {
          where: { id: contractorProfile.id },
          transaction,
        },
      )

      await Job.update(
        { paid: true, paymentDate: new Date() },
        {
          where: { id: jobId },
          transaction,
        },
      )

      await transaction.commit()

      return
    } catch (error: unknown) {
      await transaction.rollback()
      throw new RuntimeException('Unexpected Error')
    }
  }
}
