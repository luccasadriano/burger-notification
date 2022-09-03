import { SendGridService } from '@anchan828/nest-sendgrid'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Client, IMessage, TextContent } from '@zenvia/sdk'
import { Model } from 'mongoose'
import { NotificationDto } from './dtos/notification.dto'
import { notification } from './interfaces/notification.enum'
import { Notification } from './interfaces/notification.interface'

@Injectable()
export class AppService {
  constructor(
    private readonly sendGrid: SendGridService,
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}

  private async createMongoNotification(
    id: number,
    type: notification.SMS | notification.EMAIL,
    response: any,
    status: notification.SUCCESS | notification.ERROR,
  ): Promise<void> {
    const notification: NotificationDto = {
      id,
      type,
      response,
      status,
    }

    const createNotification = new this.notificationModel(notification)
    await createNotification.save()
  }

  async sendEmail(id: number, email: string, name: string) {
    console.log('email --->:', email)
    console.log('name --->:', name)

    console.log(process.env.FROM_EMAIL)

    const test = await this.sendGrid
      .send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Aviso de burgers',
        text: `Olá ${name}, Foi enviado seu burgão! só esperar para ver como será seu ranking`,
        html: `<strong>Olá ${name}, Foi enviado seu burgão! só esperar para ver como será seu ranking</strong>`,
      })
      .then(async (response) => {
        await this.createMongoNotification(
          id,
          notification.EMAIL,
          response,
          notification.SUCCESS,
        )
      })
      .catch(async (err) => {
        console.log('err --->', err.response.headers)
        console.log('err --->', err.response.body)
        await this.createMongoNotification(
          id,
          notification.EMAIL,
          err,
          notification.ERROR,
        )
      })

    console.log('test', test)
  }

  async sendSMS(id: number, phone: string, name: string): Promise<void> {
    // Text message using the SMS channel
    const client = new Client(process.env.ZENVIA_TOKEN)
    const sms = client.getChannel('sms')
    const content = new TextContent(
      `Olá ${name}, Foi enviado seu burgão! só esperar para ver qual será seu ranking`,
    )

    await sms
      .sendMessage(process.env.KEYWORD, phone, content)
      .then(
        async ({
          channel,
          contents,
          direction,
          from,
          id: messageId,
          to,
        }: IMessage) => {
          const response: any = {
            channel,
            contents,
            direction,
            from,
            to,
            messageId,
          }
          await this.createMongoNotification(
            id,
            notification.SMS,
            response,
            notification.SUCCESS,
          )
        },
      )
      .catch(async (err) => {
        console.log(err)

        await this.createMongoNotification(
          id,
          notification.SMS,
          err,
          notification.ERROR,
        )
      })
  }
}
