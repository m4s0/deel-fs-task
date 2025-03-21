import { Request } from 'express'
import { Profile } from '../model/Profile'

export default interface RequestInterface extends Request {
  profile: Profile
  query: {
    type?: string
    start?: string
    end?: string
    limit?: string
  }
  body: {
    id?: string
    amount?: string
  }
  params: {
    id?: string
    jobId?: string
    profileId?: string
  }
}
