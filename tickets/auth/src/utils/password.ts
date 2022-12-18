import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export const toHash = async (password: string, salt?: string): Promise<string> => {
  salt = salt ?? randomBytes(8).toString('hex')
  const buffer = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buffer.toString('hex')}.${salt}`
}

export const compare = async (storedPassword: string, suppliedPassword: string): Promise<boolean> => {
  const [, salt] = storedPassword.split('.')
  return storedPassword === await toHash(suppliedPassword, salt)
}
