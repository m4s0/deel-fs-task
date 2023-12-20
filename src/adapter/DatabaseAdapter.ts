import { inject, singleton } from 'tsyringe'
import { Sequelize } from 'sequelize-typescript'
import { Profile } from '../model/Profile'
import { Contract } from '../model/Contract'
import { Job } from '../model/Job'

@singleton()
export class DatabaseAdapter {
  private readonly sequelize: Sequelize

  constructor(@inject('storage') storage: string, @inject('databaseLogging') logging: boolean = true) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storage,
      logging: logging ? (...msg) => console.log(msg) : logging,
      models: [Profile, Contract, Job],
    })
  }

  getConnection(): Sequelize {
    return this.sequelize
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.sequelize.authenticate()
      return true
    } catch (err) {
      console.error('Unable to connect to the database:', err)
      return false
    }
  }

  async destroy(): Promise<void> {
    await this.sequelize.close()
  }
}
