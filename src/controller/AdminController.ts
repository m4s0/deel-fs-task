import { injectable } from 'tsyringe'
import RequestInterface from '../interface/RequestInterface'
import { Response } from 'express'
import { handleResponseHelper } from '../helper/handleResponseHelper'
import { transformJobsToBestClients } from '../service/transformJobsToBestClients'
import { JobRepository } from '../repository/JobRepository'
import { ProfileRepository } from '../repository/ProfileRepository'

@injectable()
export class AdminController {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async getBestProfession(req: RequestInterface, res: Response): Promise<void> {
    if (req.query.start === undefined || req.query.end === undefined) {
      res.status(400).json('start and end is required')
    }

    const result = await this.profileRepository.findProfileThatEarnedTheMost(
      new Date(String(req.query.start)),
      new Date(String(req.query.end)),
    )

    handleResponseHelper(result, res)
  }

  async getBestClients(req: RequestInterface, res: Response): Promise<void> {
    if (req.query.start === undefined || req.query.end === undefined) {
      res.status(400).json('start and end is required')
    }

    const jobs = await this.jobRepository.findJobsThatPayTheMost(
      new Date(String(req.query.start)),
      new Date(String(req.query.end)),
      Number(req.query.limit),
    )
    const result = transformJobsToBestClients(jobs)

    handleResponseHelper(result, res)
  }
}
