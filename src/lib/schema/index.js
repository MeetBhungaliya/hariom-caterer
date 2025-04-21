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

export const addEditCrockerSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
  name_hi: z.string({ required_error: 'Hinidi name is required' }).trim(),
  person: z
    .number({ required_error: 'Person is required' })
    .min(1, { message: 'Minimum 1 person is allowed' }),
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .min(1, { message: 'Minimum 1 quantity is allowed' }),
})

export const addEditCategorySchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
})
