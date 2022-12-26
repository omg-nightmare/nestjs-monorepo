import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

// Contants
import routes from './routes/routes'
import { AppModule } from './app.module'
import { setupProxies } from './middlewares/routes'
import { setupAuthen } from './middlewares/auth'
import { PrismaService } from './configs/database/prisma.service'
import { AllExceptionsFilter } from 'libs/exception-filter'
import { LoggerService } from 'libs/logger/src'
1
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  // Load Configuration
  const configService = app.get(ConfigService)
  const PORT = configService.get<number>('PORT')

  // Routes - Authen , Rate Limit, Public
  setupAuthen(app, routes)
  setupProxies(app, routes)

  const adapterHost = app.get(HttpAdapterHost)
  const loggerService = app.get(LoggerService)
  app.useLogger(loggerService)
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost, loggerService))
  app.enableCors()

  // Close Hook Prisma
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(PORT)
}
bootstrap()
