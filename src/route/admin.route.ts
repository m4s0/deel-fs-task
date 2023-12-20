import express, { NextFunction, Response } from 'express'
import { container } from 'tsyringe'
import { GetProfile } from '../middleware/GetProfile'
import { AdminController } from '../controller/AdminController'
import RequestInterface from '../interface/RequestInterface'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const getProfile = container.resolve(GetProfile)
const adminController = container.resolve(AdminController)

const adminRouter = express.Router()

adminRouter.get(
  '/best-profession',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => adminController.getBestProfession(req, res),
)
adminRouter.get(
  '/best-clients',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => adminController.getBestClients(req, res),
)

export default adminRouter
