import { injectable } from 'tsyringe'
import { handleResponseHelper } from '../helper/handleResponseHelper'
import RequestInterface from '../interface/RequestInterface'
import { Response } from 'express'
import { ProfileRepository } from '../repository/ProfileRepository'

@injectable()
export class ProfileController {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getAllProfiles(req: RequestInterface, res: Response): Promise<void> {
    const result = await this.profileRepository.findAllByType(String(req.query?.type))

    handleResponseHelper(result, res)
  }

  async getProfile(req: RequestInterface, res: Response): Promise<void> {
    const result = await this.profileRepository.findOneById(Number(req.params?.id))

    handleResponseHelper(result, res)
  }
}
