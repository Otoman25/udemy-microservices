import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from './app'

let mongo: MongoMemoryServer

declare global {
  // eslint-disable-next-line no-var
  var signin: () => Promise<string[]>
}

jest.mock('./utils/environment', () => {
  return {
    environment: {
      jwt: { JWT_KEY: 'asdf' },
      cookieSession: { secure: false }
    }
  }
})

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo !== undefined) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  return response.get('Set-Cookie')
}
