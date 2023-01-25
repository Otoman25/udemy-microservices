import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/orders'
import { Ticket } from '../../models/tickets'

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()
    return ticket
}

it('it fetches orders for a user', async () => {
    // Create three tickets
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userOne = global.signin()
    const userTwo = global.signin()

    // Create one order as user #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketOne.id})
        .expect(201)

    // Create two orders as user #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201)
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201)

    // Make request to get orders for #2 & only for #2

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0]).toMatchObject(orderOne)
    expect(response.body[1]).toMatchObject(orderTwo)
})