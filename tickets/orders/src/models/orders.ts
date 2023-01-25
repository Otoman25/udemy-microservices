import { OrderStatus } from '@thegrinch.learning/common'
import mongoose, { Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { TicketDocument } from './tickets'

export { OrderStatus }

// expected parameters to build a user
interface OrderProperties {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDocument
};

// structure of a single user returned from mongoose
interface OrderDocument extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDocument
  version: number
}

// defining own methods to add to the mongoose model
interface OrderModel extends mongoose.Model<OrderDocument> {
  build: (properties: OrderProperties) => OrderDocument
}

// Schema for the mongoose model
const orderSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
    required: false
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform (doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (properties: OrderProperties) => {
  return new Order(properties)
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema)

export { Order }
