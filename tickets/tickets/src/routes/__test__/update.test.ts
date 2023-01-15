import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 401 if the user is not logged in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send()
        .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
   .post('/api/tickets')
   .set('Cookie', signin())
   .send({
      title: 'title',
      price: 10
   }).expect(201)
   
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            price: 10
        })
        .expect(401)

        // could add check to ensure ticket was NOT added
})

it('returns a 400 if the user provides an invalid title or price', async () => {
    const auth = global.signin()

    const response = await request(app)
   .post('/api/tickets')
   .set('Cookie', auth)
   .send({
      title: 'title',
      price: 10
   }).expect(201)
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', auth)
        .send({
            title: '',
            price: -5
        })
        .expect(400)
    
        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', auth)
        .send({
            title: '',
            price: 5
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', auth)
        .send({
            title: 'title',
            price: -5
        })
        .expect(400)
})

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            price: 10
        })
        .expect(404)
})

it('updates a ticket when provided valid inputs', async () => {
    const auth = global.signin()

    const response = await request(app)
   .post('/api/tickets')
   .set('Cookie', auth)
   .send({
      title: 'title',
      price: 10
   }).expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', auth)
        .send({
            title: 'title',
            price: 10
        })
        .expect(201)
})