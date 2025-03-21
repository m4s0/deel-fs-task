import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { Contract } from './Contract'

@Table
export class Profile extends Model {
  @Column({
    primaryKey: true,
  })
  declare id: number
  @Column
  declare firstName: string
  @Column
  declare lastName: string
  @Column
  declare profession: string
  @Column
  declare balance: number
  @Column
  declare type: 'client' | 'contractor'

  @HasMany(() => Contract, 'contractorId')
  declare contractors: Contract[]

  @HasMany(() => Contract, 'clientId')
  declare clients: Contract[]
}
