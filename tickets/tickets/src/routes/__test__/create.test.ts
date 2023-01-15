import request from 'supertest'
import { app } from '../../app'

it('has a route handler listening to /api/tickets for post requests', async () => {
   const response = await request(app)
   .post('/api/tickets')
   .send({}) 

   expect(response.statusCode).not.toEqual(404)
})

it('can only be accessed if the user is authenticated', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({})

    expect(response.statusCode).toEqual(401)
})

it('returns a status other than 401 if the user is signed in', async () => {
   const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({})

   expect(response.statusCode).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
   await request(app)
   .post('/api/tickets')
   .set('Cookie', signin())
   .send({
      title: '',
      price: 10
   }).expect(400)

   await request(app)
   .post('/api/tickets')
   .set('Cookie', signin())
   .send({
      price: 10
   }).expect(400)

})

it('returns an error if an invalid price is provided', async () => {
   await request(app)
   .post('/api/tickets')
   .set('Cookie', signin())
   .send({
      title: 'title',
      price: -10
   }).expect(400)

   await request(app)
   .post('/api/tickets')
   .set('Cookie', signin())
   .send({
      title: 'title',
   }).expect(400)
})

it('creates a ticket with valid inputs', async () => {
   //add in database mock/check the ticket was stored
   await request(app)
   .post('/api/tickets')
   .set('Cookie', signin())
   .send({
      title: 'title',
      price: 10
   }).expect(201)
})