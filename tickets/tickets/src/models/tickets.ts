import mongoose, { Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// expected parameters to build a user
interface TicketProperties {
  title: string
  price: number
  userId: string
};

// defining own methods to add to the mongoose model
interface TicketModel extends mongoose.Model<any> {
  build: (properties: TicketProperties) => TicketDocument
}

// structure of a single user returned from mongoose
interface TicketDocument extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}

// Schema for the mongoose model
const ticketSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: false
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (properties: TicketProperties) => {
  return new Ticket(properties)
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema)

export { Ticket }
