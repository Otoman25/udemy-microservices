import { OrderStatus, ExpirationCompleteEvent } from '@thegrinch.learning/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/orders';
import { Ticket } from '../../../models/tickets';
import { natsWrapper } from '../../../NatsWrapper';
import { ExpirationCompleteListener } from '../ExpirationCompleteListener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, message };
};

it('updates the order status to cancelled', async () => {
    const { listener, order, data, message: message } = await setup()

    await listener.onMessage(data, message)
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
    const { listener, order, data, message } = await setup()

    await listener.onMessage(data, message)

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)

})

it('acknowledges the message', async () => {
    const { listener, data, message } = await setup()
    await listener.onMessage(data, message)
    expect(message.ack).toBeCalled()

})