import { OrderStatus } from '@thegrinch.learning/common'
import mongoose, { Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

export { OrderStatus }

// expected parameters to build a user
interface OrderProperties {
  id: string
  userId: string
  status: OrderStatus
  price: number
  version: number
};

// structure of a single user returned from mongoose
interface OrderDocument extends mongoose.Document {
  userId: string
  status: OrderStatus
  price: number
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
  price: {
    type: Number,
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
  return new Order({
    _id: properties.id,
    userId: properties.userId,
    price: properties.price,
    status: properties.status,
    version: properties.version
  })
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema)

export { Order }
