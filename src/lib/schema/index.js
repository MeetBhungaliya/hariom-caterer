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

export const addEditItemSchema = z.object({
  category_id: z.string({ required_error: 'Category is required' }).trim().regex(/^\d+$/, 'Invalid category id').or(z.number()),
  scm_id: z.string({ required_error: 'Subcategory is required' }).trim().regex(/^\d+$/, 'Invalid subcategory id').or(z.number()),
  name: z.string({ required_error: 'Name is required' }).trim(),
  name_hi: z.string({ required_error: 'Hindi name name is required' }).trim(),
  price: z.string({ required_error: 'Price is required' }).trim().regex(/^\d+$/, 'Price must be a number').or(z.number()),
  ingredient: z.string({ required_error: 'Ingredient is required' }).min(1, { message: 'Ingredient is required' }).trim(),
  recipe: z.string({ required_error: 'Recipe is required' }).trim(),
  image: z.any().nullable()
})

export const addEditItemCrockerySchema = z.object({
  crockery_id: z.string({ required_error: 'Crockery is required' }).trim().regex(/^\d+$/, 'Invalid crockery id').or(z.number()),
})

export const addEditPackageSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim(),
  data: z.array(
    z.object({
      pim_id: z.number({ required_error: 'Package item is required' }),
      quantity: z
        .number({ required_error: 'Quantity is required' })
        .min(1, { message: 'Quantity must be at least 1' })
        .max(99, { message: 'Quantity must be less than 100' }),
    })
  ).min(1, { message: 'At least one package item is required' })
})
