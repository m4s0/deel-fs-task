import express, { NextFunction, Response } from 'express'
import { JobController } from '../controller/JobController'
import { container } from 'tsyringe'
import { GetProfile } from '../middleware/GetProfile'
import RequestInterface from '../interface/RequestInterface'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const getProfile = container.resolve(GetProfile)
const jobController: JobController = container.resolve(JobController)

const jobRouter = express.Router()

jobRouter.get(
  '/unpaid',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => jobController.getUnpaidJobs(req, res),
)
jobRouter.get(
  '/',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => jobController.getAllJobs(req, res),
)
jobRouter.post(
  '/:jobId/pay',
  (req: RequestInterface, res: Response, next: NextFunction) => getProfile.getByRequest(req, res, next),
  (req: RequestInterface, res: Response) => jobController.payForJob(req, res),
)

export default jobRouter
