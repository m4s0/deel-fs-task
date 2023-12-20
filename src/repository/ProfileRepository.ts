import { injectable } from 'tsyringe'
import { Repository, Sequelize } from 'sequelize-typescript'
import { Profile } from '../model/Profile'
import { Contract } from '../model/Contract'
import { Job } from '../model/Job'
import { Op } from 'sequelize'
import { DatabaseAdapter } from '../adapter/DatabaseAdapter'

@injectable()
export class ProfileRepository {
  private profileRepository: Repository<Profile>

  constructor(databaseAdapter: DatabaseAdapter) {
    this.profileRepository = databaseAdapter.getConnection().getRepository(Profile)
  }

  async findOneById(id: number): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      raw: true,
      nest: true,
      where: { id: id },
    })
  }

  async findAllByType(type: string): Promise<Profile[]> {
    let options = {}

    if (type == 'client' || type == 'contractor') {
      options = {
        raw: true,
        nest: true,
        where: {
          type: {
            [Op.eq]: type,
          },
        },
      }
    }

    return await this.profileRepository.findAll(options)
  }

  async findProfileThatEarnedTheMost(start: Date, end: Date): Promise<Profile> {
    const profiles = await this.profileRepository.findAll({
      raw: true,
      nest: true,
      attributes: [
        'id',
        'profession',
        'firstName',
        'lastName',
        [Sequelize.fn('SUM', Sequelize.col('price')), 'earned'],
      ],
      include: [
        {
          model: Contract,
          as: 'contractors',
          attributes: [],
          where: {
            status: 'terminated',
          },
          include: [
            {
              model: Job,
              attributes: [],
              where: {
                paid: true,
                paymentDate: {
                  [Op.between]: [start, end],
                },
              },
            },
          ],
        },
      ],
      where: {
        type: 'contractor',
      },
      group: ['profession'],
      order: [[Sequelize.col('earned'), 'DESC']],
      subQuery: false,
    })

    return profiles[0]
  }
}
