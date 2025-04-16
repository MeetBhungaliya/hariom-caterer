import { z } from 'zod'

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .email({ message: 'Invalid email format' })

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })
// .regex(/[A-Z]/, {
//   message: 'Password must contain at least one uppercase letter',
// })
// .regex(/\d/, { message: 'Password must contain at least one number' })
