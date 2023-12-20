import express, { NextFunction, Response } from 'express'
import { container } from 'tsyringe'
import { BalanceController } from '../controller/BalanceController'
import { GetProfile } from '../middleware/GetProfile'
import RequestInterface from '../interface/RequestInterface'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const getProfile = container.resolve(GetProfile)
const balanceController = container.resolve(BalanceController)

const balanceRouter = express.Router()

balanceRouter.post(
  '/deposit/:profileId',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => balanceController.deposit(req, res),
)

export default balanceRouter
