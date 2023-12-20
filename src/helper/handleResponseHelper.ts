import { Model } from 'sequelize'
import { Response } from 'express'
import httpError from 'http-errors'
import { BestClient } from '../types'

export const handleResponseHelper = (
  result: Model | Model[] | BestClient[] | null | undefined,
  res: Response,
): void => {
  if (!result) {
    res.status(404).json(httpError.NotFound())
  }
  res.status(200).json(result)
}
