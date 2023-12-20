import express, { Response } from 'express'
import { container } from 'tsyringe'
import { ProfileController } from '../controller/ProfileController'
import RequestInterface from '../interface/RequestInterface'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const profileController: ProfileController = container.resolve(ProfileController)

const profileRouter = express.Router()

profileRouter.get('/', (req: RequestInterface, res: Response) => profileController.getAllProfiles(req, res))
profileRouter.get('/:id', (req: RequestInterface, res: Response) => profileController.getProfile(req, res))

export default profileRouter
