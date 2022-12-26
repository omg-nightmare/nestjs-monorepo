import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvService {
  constructor(private configuration: ConfigService) {}

  Port(): number {
    return this.configuration.get<number>('PORT')
  }

  TokenExpired(): string {
    return this.configuration.get<string>('TOKEN_EXPIRED')
  }

  TokenSecretKey(): string {
    return this.configuration.get<string>('TOKEN_SECRET_KEY')
  }
}
