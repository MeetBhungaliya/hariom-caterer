import { z } from 'zod'
import { emailSchema, passwordSchema, phoneSchema } from './common'

export const loginSchema = z.object({
  // email: emailSchema,
  email: z.string({ required_error: 'Email or username is required' }).trim(),
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
  crockery_ids: z.array(
    z.object({
      value: z.number({ required_error: 'Category item is required' }),
      label: z.string({ required_error: 'Category item is required' }),
    })).catch([])
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
  price: z.number({ required_error: 'Price is required' }),
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

export const coastingItemSchema = z.object({
  pim_id: z.number({ required_error: 'Item ID is required' }).nullable(),
  item_id: z.number({ required_error: 'Item ID is required' }).nullable().optional(),
})

export const addEditCoastingSchema = z.object({
  client_id: z.number({ required_error: 'Party selection is required' }),
  package_id: z.number({ required_error: 'Package selection is required' }),
  // date: z.date({ required_error: 'Date is required' }),
  date: z.string({ required_error: 'Date is required' }).min(1, 'Date is required'),
  person: z.number({ required_error: 'Number of persons is required' }).min(1, 'At least one person must be specified'),
  jain_counter: z.string({ required_error: 'Jain counter is required' }).min(0, 'Jain counter cannot be negative'),
  time: z.string({ required_error: 'Event time is required' }).min(1, 'Please select a valid time slot'),
  venue: z.string({ required_error: 'Venue is required' }).min(1, 'Please enter a valid venue address'),
  // status: z.enum(STATUS_OPTIONS.map(option => option.value)),
  item: z.array(coastingItemSchema, { required_error: 'At least one item is required' }).min(1, 'Please add at least one item to the coasting list'),
  per_plate_cost: z.number({ required_error: 'Per plate cost is required' }),
  selling_price: z.number({ required_error: 'Selling price is required' }),
  // pro: z.number({ invalid_type_error: 'Pro must be a number' }).optional(),
  // bom_boys: z.number({ invalid_type_error: 'Bombay boys count must be a number' }).optional(),
  // packed_bottle: z.number({ invalid_type_error: 'Packed bottles count must be a number' }).optional(),
})

export const addEditFunctionSchema = z.object({
  client_id: z.number({ required_error: 'Party selection is required' }),
  venue: z.string({ required_error: 'Venue is required' }).min(1, 'Please enter a valid venue address'),
})
