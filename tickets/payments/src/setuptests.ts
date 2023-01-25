import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from './app'
import { environment, EnvironmentVariables } from './utils/environment'
import * as jwt from 'jsonwebtoken'

let mongo: MongoMemoryServer

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('./utils/environment', () => {
  const variables: EnvironmentVariables = {
      stripe: {
        STRIPE_KEY: 'abc'
      },
      jwt: { JWT_KEY: 'test'},
      cookieSession: { secure: false },
      mongo: { connectionString: 'someurl' },
      nats: { 
        clusterId: 'abc',
        clientId: 'abc',
        queueGroupName: 'abc',
        connectionString: 'someurl'
      }
  }
  return {environment: variables }
})

jest.mock('./NatsWrapper')

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  mongoose.set('strictQuery', false)
  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
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

global.signin = (id?: string): string[] => {
  id = id ?? new mongoose.Types.ObjectId().toHexString()
  const payload = {
    id,
    email: 'test@test.com'
  }

  const token = jwt.sign(payload, environment.jwt.JWT_KEY)
  const sessionJSON = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`session=${base64}`]
}