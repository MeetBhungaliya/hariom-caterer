import { z } from 'zod'

export const STATUS_OPTIONS = [
  { value: "order", label: "Order" },
  { value: "costing", label: "Costing" },
]

export const paginationSchema = z.object({
  page: z
    .string()
    .transform(val => Number.parseInt(val, 10))
    .refine(val => !Number.isNaN(val) && val > 0)
    .or(z.number())
    .catch(1),
  limit: z
    .string()
    .transform(val => Number.parseInt(val, 10))
    .refine(val => !Number.isNaN(val) && val > 0)
    .or(z.number())
    .catch(10),
})

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .email({ message: 'Invalid email format' })

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })

export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .length(10, { message: 'Phone number must be exactly 10 digits' })
  .regex(/^\d+$/, { message: 'Phone number must only contain digits (0-9)' }).or(z.number({ required_error: 'Phone number is required' }).refine(val => val.toString().length === 10, {
    message: 'Phone number must be exactly 10 digits',

  }));

export const statusSchema = z.object({
  status: z.enum(STATUS_OPTIONS.map(option => option.value)).catch(STATUS_OPTIONS[0].value)
})