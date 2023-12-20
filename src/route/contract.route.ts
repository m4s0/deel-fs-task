import express, { NextFunction, Response } from 'express'
import { container } from 'tsyringe'
import { ContractController } from '../controller/ContractController'
import RequestInterface from '../interface/RequestInterface'
import { GetProfile } from '../middleware/GetProfile'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const getProfile = container.resolve(GetProfile)
const contractController = container.resolve(ContractController)

const contractRouter = express.Router()

contractRouter.get(
  '/:id',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => contractController.getContractById(req, res),
)

export default contractRouter
