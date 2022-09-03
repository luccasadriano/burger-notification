import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'
import { AppModule } from './app.module'

const logger = new Logger('notification Ranking')

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'notification',
          brokers: [':9092'],
        },
        consumer: {
          groupId: 'notification-consumer',
          allowAutoTopicCreation: true,
        },
        producer: {
          createPartitioner: Partitioners.DefaultPartitioner,
        },
      },
    },
  )

  await app
    .listen()
    .then(() => {
      logger.log('notification-ranking is running')
    })
    .catch((err) => logger.log('err', err))
}
bootstrap()
