import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import contractRouter from './route/contract.route'
import profileRouter from './route/profile.route'
import jobRouter from './route/job.route'
import balanceRouter from './route/balance.route'
import adminRouter from './route/admin.route'
import userRouter from './route/user.route'

const app: Application = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/contracts', contractRouter)
app.use('/profiles', profileRouter)
app.use('/jobs', jobRouter)
app.use('/balances', balanceRouter)
app.use('/admin', adminRouter)
app.use('/', userRouter)

export default app
