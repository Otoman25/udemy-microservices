export interface EnvironmentVariables {
  jwt: {
    JWT_KEY: string
  }
  cookieSession: {
    secure: boolean
  }
  mongo: {
    connectionString: string
  }
  nats: {
    clusterId: string,
    connectionString: string
    clientId: string
    queueGroupName: string
  }
}

const asString = (reference: any): string => {
  if (reference === undefined) {
    throw new Error('Key is undefined')
  }

  return reference
}

const asBoolean = (reference: any): boolean => {
  return asString(reference) === 'true'
}

export const environment: EnvironmentVariables = {
  jwt: {
    JWT_KEY: asString(process.env.JWT_KEY)
  },
  cookieSession: {
    secure: asBoolean(process.env.COOKIE_SESSION_SECURE)
  },
  mongo: { 
    connectionString: asString(process.env.MONGO_URI)
  },
  nats: {
    clusterId: asString(process.env.NATS_CLUSTER_ID),
    connectionString: asString(process.env.NATS_CONNECTION_STRING),
    clientId: asString(process.env.NATS_CLIENT_ID),
    queueGroupName: asString(process.env.NATS_QUEUE_GROUP_NAME)
  }
}
