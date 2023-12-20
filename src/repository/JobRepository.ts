import { injectable } from 'tsyringe'
import { Job } from '../model/Job'
import { Contract } from '../model/Contract'
import { Profile } from '../model/Profile'
import { Repository, Sequelize } from 'sequelize-typescript'
import { Op, Transaction } from 'sequelize'
import { DatabaseAdapter } from '../adapter/DatabaseAdapter'

@injectable()
export class JobRepository {
  private jobRepository: Repository<Job>

  constructor(databaseAdapter: DatabaseAdapter) {
    this.jobRepository = databaseAdapter.getConnection().getRepository(Job)
  }

  async findOneActiveById(id: number): Promise<Job | null> {
    return await this.jobRepository.findOne({
      raw: true,
      nest: true,
      where: { id: id },
      include: [
        {
          model: Contract,
          where: { status: 'in_progress' },
        },
      ],
    })
  }

  async findUnpaidJobsByProfileId(profileId: number): Promise<Job[]> {
    return await this.jobRepository.findAll({
      raw: true,
      nest: true,
      include: [
        {
          attributes: [],
          model: Contract,
          required: true,
          where: {
            [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
            status: {
              [Op.eq]: 'in_progress',
            },
          },
        },
      ],
      where: {
        [Op.or]: [{ paid: false }, { paid: null }],
      },
    })
  }

  async findAllJobsByProfileId(profileId: number): Promise<Job[]> {
    return await this.jobRepository.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: Contract,
          required: true,
          where: {
            [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
            status: {
              [Op.eq]: 'in_progress',
            },
          },
        },
      ],
    })
  }

  async findAllActiveJobsToPayByProfileId(profileId: number, transaction: Transaction): Promise<Job[]> {
    return await this.jobRepository.findAll({
      raw: true,
      nest: true,
      include: [
        {
          attributes: [],
          model: Contract,
          required: true,
          where: {
            clientId: profileId,
            status: 'in_progress',
          },
        },
      ],
      where: {
        paid: true,
      },
      transaction,
    })
  }

  async findJobsThatPayTheMost(start: Date, end: Date, limit: number): Promise<Job[]> {
    return await this.jobRepository.findAll({
      raw: true,
      nest: true,
      attributes: [[Sequelize.fn('sum', Sequelize.col('price')), 'paid']],
      include: [
        {
          model: Contract,
          attributes: ['id'],
          include: [
            {
              model: Profile,
              as: 'client',
              where: { type: 'client' },
              attributes: ['id', 'firstName', 'lastName'],
              required: true,
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [start, end],
        },
      },
      order: [[Sequelize.col('paid'), 'DESC']],
      group: ['contract.client.id'],
      limit: Number(limit) ? Number(limit) : 2,
    })
  }
}
