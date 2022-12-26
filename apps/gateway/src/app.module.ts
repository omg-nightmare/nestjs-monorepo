import { LoggerModule } from '@app/logger'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './configs/database/prisma.module'
import { EnvModule } from './configs/env/env.module'
import { JwtTokenModule } from './jwt/jwt.module'

@Module({
  imports: [EnvModule, AuthModule, PrismaModule, JwtTokenModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
