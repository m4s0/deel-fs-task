import { injectable } from 'tsyringe'
import RequestInterface from '../interface/RequestInterface'
import { Response } from 'express'
import { ProfileRepository } from '../repository/ProfileRepository'

@injectable()
export class UserController {
  constructor(protected profileRepository: ProfileRepository) {}

  async login(req: RequestInterface, res: Response): Promise<void> {
    const profile = await this.profileRepository.findOneById(Number(req.body?.id))

    if (profile === null) {
      res.status(401).end()
    }

    res.status(200).end()
  }
}
