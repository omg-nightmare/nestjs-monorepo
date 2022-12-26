import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { ErrCodeByName, errorName } from 'libs/errors'
import { AuthService } from '../auth/auth.service'
import type routes from '../routes/routes'
import { JwtTokenService } from '../jwt/jwt.service'

interface IPayloadJwt {
  userId: string
  expiresIn: string
}

export const setupAuthen = (
  app: NestFastifyApplication,
  router: typeof routes,
) => {
  router.map((val) => {
    if (val.auth) {
      app.use(val.url, mwAuthenication(app))
    }
  })
}

const mwAuthenication =
  (app: NestFastifyApplication) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers['authorization'] as string
      if (!authorization) {
        throw ErrCodeByName(errorName.e1005002)
      }

      const tokenArr = authorization?.split(' ')
      if (tokenArr[0] !== 'Bearer') {
        throw ErrCodeByName(errorName.e1005001)
      }

      // Get Service
      const jwtTokenService = app.get(JwtTokenService)
      const appService = app.get(AuthService)

      // Decode TOKEN
      const decode = await jwtTokenService.verify(tokenArr[1])
      if (!decode) {
        throw ErrCodeByName(errorName.e1005003, 'invalid token')
      }
      const { userId } = decode as IPayloadJwt

      const user = await appService.user({ id: userId })
      if (!user) {
        throw ErrCodeByName(errorName.e1005004, 'userId not found')
      }

      req.headers['request_id'] = uuidv4()
      req.headers['username'] = user.email
      req.headers['user_id'] = user.id
      req.headers['referrer'] = user.referrerId
      req.headers['ip_address'] = req.ip

      next()
    } catch (err) {
      next(err)
    }
  }
