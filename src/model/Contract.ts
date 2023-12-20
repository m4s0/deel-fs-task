import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { Profile } from './Profile'
import { Job } from './Job'

@Table
export class Contract extends Model {
  @Column
  declare terms: string

  @Column
  declare status: 'new' | 'in_progress' | 'terminated'

  @ForeignKey(() => Profile)
  @Column
  declare contractorId: number

  @BelongsTo(() => Profile, 'contractorId')
  declare contractor: Profile

  @ForeignKey(() => Profile)
  @Column
  declare clientId: number

  @BelongsTo(() => Profile, 'clientId')
  declare client: Profile

  @HasMany(() => Job)
  declare jobs: Job[]
}
