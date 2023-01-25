export interface EnvironmentVariables {
  redis: {
    host: string
  },
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
  redis: {
    host: asString(process.env.REDIS_HOST)
  },
  nats: {
    clusterId: asString(process.env.NATS_CLUSTER_ID),
    connectionString: asString(process.env.NATS_CONNECTION_STRING),
    clientId: asString(process.env.NATS_CLIENT_ID),
    queueGroupName: asString(process.env.NATS_QUEUE_GROUP_NAME)
  }
}
