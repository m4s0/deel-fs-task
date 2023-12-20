import express, { Response } from 'express'
import { container } from 'tsyringe'
import RequestInterface from '../interface/RequestInterface'
import { UserController } from '../controller/UserController'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const userController: UserController = container.resolve(UserController)

const userRouter = express.Router()

userRouter.post('/login', (req: RequestInterface, res: Response) => userController.login(req, res))

export default userRouter
