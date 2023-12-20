import { injectable } from 'tsyringe'
import RequestInterface from '../interface/RequestInterface'
import { NextFunction, Response } from 'express'
import { ProfileRepository } from '../repository/ProfileRepository'

@injectable()
export class GetProfile {
  constructor(protected profileRepository: ProfileRepository) {}

  async getByRequest(req: RequestInterface, res: Response, next: NextFunction): Promise<Response | undefined> {
    const profile = await this.profileRepository.findOneById(Number(req.get('profile_id')))

    if (!profile) {
      return res.status(401).end()
    }

    req.profile = profile
    next()
  }
}
