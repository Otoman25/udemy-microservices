import mongoose, { Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './orders'

// expected parameters to build a user
interface TicketProperties {
  id: string
  title: string
  price: number
};

// structure of a single user returned from mongoose
interface TicketDocument extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved: () => Promise<boolean>
}

// defining own methods to add to the mongoose model
interface TicketModel extends mongoose.Model<TicketDocument> {
  build: (properties: TicketProperties) => TicketDocument
  checkEventSequential: (event: { id: string, version: number }) => Promise<TicketDocument | null>
}

// Schema for the mongoose model
const ticketSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform (doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (properties: TicketProperties) => {
  let attrs: Record<string, any> = properties
  attrs._id = attrs.id
  delete attrs['id']

  return new Ticket({
    ...attrs
  })
}

ticketSchema.statics.checkEventSequential = (event: {id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version -1
  })
}

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed
      ]
    }
  })

  return !(existingOrder == null)
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema)

export { Ticket, TicketDocument }
