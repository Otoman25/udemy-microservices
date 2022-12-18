import request from 'supertest'
import { app } from '../../app'

it('Returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'testingpassword' })
    .expect(201)
})

it('Returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test', password: 'testingpassword' })
    .expect(400)
})

it('Returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 't' })
    .expect(400)
})

it('Returns a 400 with no email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send()
    .expect(400)
})

it('Returns a 400 when trying to sign up with a duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'testingpassword' })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'testingpassword' })
    .expect(400)
})

it('Sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'testingpassword' })

  expect(response.get('Set-Cookie')).toBeDefined()
  expect(response.statusCode).toStrictEqual(201)
})
