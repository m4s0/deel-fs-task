import { injectable } from 'tsyringe'
import { handleResponseHelper } from '../helper/handleResponseHelper'
import { LogicException } from '../exception/LogicException'
import { RuntimeException } from '../exception/RuntimeException'
import { PayForJobUseCase } from '../usecase/PayForJobUseCase'
import RequestInterface from '../interface/RequestInterface'
import { Response } from 'express'
import { JobRepository } from '../repository/JobRepository'

@injectable()
export class JobController {
  constructor(
    private readonly jobRepository: JobRepository,
    protected payForJobUseCase: PayForJobUseCase,
  ) {}

  async getUnpaidJobs(req: RequestInterface, res: Response): Promise<void> {
    const result = await this.jobRepository.findUnpaidJobsByProfileId(req.profile.id)

    handleResponseHelper(result, res)
  }

  async getAllJobs(req: RequestInterface, res: Response): Promise<void> {
    const result = await this.jobRepository.findAllJobsByProfileId(req.profile.id)

    handleResponseHelper(result, res)
  }

  async payForJob(req: RequestInterface, res: Response): Promise<void> {
    try {
      await this.payForJobUseCase.execute(Number(req.params?.jobId), req.profile)
      res.status(201).json('payment has been made successfully')
    } catch (error: unknown) {
      if (error instanceof LogicException) {
        res.status(400).json(error.message)
      }
      if (error instanceof RuntimeException) {
        res.status(500).json(error.message)
      }
    }
  }
}
