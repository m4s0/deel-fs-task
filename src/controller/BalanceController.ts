import { injectable } from 'tsyringe'
import { LogicException } from '../exception/LogicException'
import { RuntimeException } from '../exception/RuntimeException'
import RequestInterface from '../interface/RequestInterface'
import { Response } from 'express'
import { DepositUseCase } from '../usecase/DepositUseCase'

@injectable()
export class BalanceController {
  constructor(protected depositUseCase: DepositUseCase) {}

  async deposit(req: RequestInterface, res: Response): Promise<void> {
    try {
      const balance = await this.depositUseCase.execute(Number(req.body.amount), Number(req.params.profileId))
      res.status(201).json('your balance is ' + balance)
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
