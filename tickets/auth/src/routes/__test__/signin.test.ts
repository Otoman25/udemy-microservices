import request from 'supertest'
import { app } from '../../app'

it('Fails with an invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'nope@test.com',
      password: 'password'
    })
    .expect(400)
})

it('Fails with an invalid password', async () => {
  await global.signin()

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'passwordswrong'
    })
    .expect(400)
})

it('Responds with a cookie when given valid credentials', async () => {
  await global.signin()

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
