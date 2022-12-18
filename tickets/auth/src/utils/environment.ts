interface EnvironmentVariables {
  jwt: {
    JWT_KEY: string
  }
  cookieSession: {
    secure: boolean
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
  }
}
