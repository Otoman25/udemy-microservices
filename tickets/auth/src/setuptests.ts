import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongo: MongoMemoryServer

declare global {
  const signin: () => Promise<string[]>
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
