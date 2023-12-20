declare module Express {
  export interface Request extends Express.Request {
    profile: Profile
  }
}
