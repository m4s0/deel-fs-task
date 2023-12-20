import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Contract } from './Contract'

@Table
export class Job extends Model {
  @Column
  declare description: string
  @Column
  declare price: number
  @Column
  declare paid: boolean
  @Column
  declare paymentDate: Date

  @ForeignKey(() => Contract)
  @Column
  declare contractId: number

  @BelongsTo(() => Contract, 'contractId')
  declare contract: Contract
}
