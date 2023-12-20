import { injectable } from 'tsyringe'
import { Contract } from '../model/Contract'
import { Repository } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { DatabaseAdapter } from '../adapter/DatabaseAdapter'
import { Profile } from '../model/Profile'

@injectable()
export class ContractRepository {
  private contractRepository: Repository<Contract>

  constructor(databaseAdapter: DatabaseAdapter) {
    this.contractRepository = databaseAdapter.getConnection().getRepository(Contract)
  }

  async findOneByIdAndProfileId(id: number, profileId: number): Promise<Contract | null> {
    return await this.contractRepository.findOne({
      raw: true,
      nest: true,
      where: {
        id,
        [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
      },
      include: [
        {
          model: Profile,
          as: 'contractor',
        },
        {
          model: Profile,
          as: 'client',
        },
      ],
    })
  }
}
