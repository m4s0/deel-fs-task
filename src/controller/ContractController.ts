import { injectable } from 'tsyringe'
import { handleResponseHelper } from '../helper/handleResponseHelper'
import RequestInterface from '../interface/RequestInterface'
import { Response } from 'express'
import { ContractRepository } from '../repository/ContractRepository'

@injectable()
export class ContractController {
  constructor(private readonly contractRepository: ContractRepository) {}

  async getContractById(req: RequestInterface, res: Response): Promise<void> {
    const result = await this.contractRepository.findOneByIdAndProfileId(Number(req.params.id), req.profile.id)

    handleResponseHelper(result, res)
  }
}
