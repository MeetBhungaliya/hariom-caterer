import { z } from 'zod'
import { emailSchema, passwordSchema, phoneSchema } from './common'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const addEditPartySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
  phone: phoneSchema,
})
