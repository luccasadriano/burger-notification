import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { AppService } from './app.service'
import { IPhone, IEmail } from './types/notification.interface'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('notification-email')
  async sendEmail(@Payload() data: IEmail): Promise<void> {
    await this.appService.sendEmail(Number(data.id), data.email, data.name)
  }

  @EventPattern('notification-sms')
  async sendSMS(@Payload() data: IPhone): Promise<void> {
    await this.appService.sendSMS(data.id, data.phone, data.name)
  }
}
