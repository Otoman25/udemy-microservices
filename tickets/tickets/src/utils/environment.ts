import { environment } from "@thegrinch.learning/common";

const asString = (reference: any): string => {
    if (reference === undefined) {
      throw new Error('Key is undefined')
    }
  
    return reference
  }

export const env = {
    ...environment,
    mongo: { connectionString: asString(process.env.MONGO_URI)}
}