import 'reflect-metadata'
import app from './app'
import { container } from 'tsyringe'
import { DatabaseAdapter } from './adapter/DatabaseAdapter'

container.register('storage', { useValue: 'database.sqlite3' })
container.register('databaseLogging', { useValue: true })

const databaseAdapter = container.resolve(DatabaseAdapter)

const PORT = 3001

init()

async function init(): Promise<void> {
  try {
    await databaseAdapter.getConnection().sync()

    const isConnected = await databaseAdapter.isConnected()
    console.log(`sequelize is connected : ${isConnected}`)

    app.listen(PORT, (): void => {
      console.log(`Express App Listening on Port ${PORT}`)
    })
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}
