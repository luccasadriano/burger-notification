import { notification } from 'src/interfaces/notification.enum'

export class NotificationDto {
  id: number
  type: notification.EMAIL | notification.SMS
  response: any
  status: notification.SUCCESS | notification.ERROR
}
