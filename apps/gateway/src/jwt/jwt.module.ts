import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EnvModule } from 'apps/gateway/src/configs/env/env.module'
import { EnvService } from 'apps/gateway/src/configs/env/env.service'
import { JwtTokenService } from './jwt.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (config: EnvService) => ({
        secret: config.TokenSecretKey(),
        signOptions: { expiresIn: config.TokenExpired() },
        verifyOptions: {
          ignoreExpiration: false,
        },
      }),
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
