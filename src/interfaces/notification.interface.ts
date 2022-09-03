import { Document } from 'mongoose'
import { notification } from './notification.enum'

export interface Notification extends Document {
  id: number
  type: notification.EMAIL | notification.SMS
  response: any
  status: notification.SUCCESS | notification.ERROR
}
