import { Request } from 'express'
import { Profile } from '../model/Profile'

export default interface RequestInterface extends Request {
  profile: Profile
}
