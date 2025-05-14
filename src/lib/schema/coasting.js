import { z } from 'zod'

// Helper function to check if date is not in future
const isNotFutureDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time part to start of day
  return date <= today
}

export const coastingItemSchema = z.object({
  pim_id: z.string({
    required_error: 'Item ID is required',
    invalid_type_error: 'Item ID must be a string'
  }),
  name: z.string({
    required_error: 'Item name is required',
    invalid_type_error: 'Item name must be a string'
  }).min(1, 'Item name cannot be empty'),
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number'
  }).min(0, 'Quantity cannot be negative'),
  unit: z.string({
    required_error: 'Unit is required',
    invalid_type_error: 'Unit must be a string'
  }).min(1, 'Unit cannot be empty'),
  rate: z.number({
    required_error: 'Rate is required',
    invalid_type_error: 'Rate must be a number'
  }).min(0, 'Rate cannot be negative'),
  amount: z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number'
  }).min(0, 'Amount cannot be negative'),
})

export const addEditCoastingSchema = z.object({
  client_id: z.string({
    required_error: 'Party selection is required',
    invalid_type_error: 'Party ID must be a string'
  }).min(1, 'Please select a valid party'),
  package_id: z.string({
    required_error: 'Package selection is required',
    invalid_type_error: 'Package ID must be a string'
  }).min(1, 'Please select a valid package'),
  date: z.date({
    required_error: 'Event date is required',
    invalid_type_error: 'Please select a valid date'
  }).refine(isNotFutureDate, {
    message: 'Event date cannot be in the future'
  }),
  person: z.number({
    required_error: 'Number of persons is required',
    invalid_type_error: 'Person count must be a number'
  }).min(1, 'At least one person must be specified'),
  jain_counter: z.number({
    required_error: 'Jain counter is required',
    invalid_type_error: 'Jain counter must be a number'
  }).min(0, 'Jain counter cannot be negative'),
  time: z.string({
    required_error: 'Event time is required',
    invalid_type_error: 'Time must be a string'
  }).min(1, 'Please select a valid time slot'),
  venue: z.string({
    required_error: 'Venue is required',
    invalid_type_error: 'Venue must be a string'
  }).min(1, 'Please enter a valid venue address'),
  item: z.array(coastingItemSchema, {
    required_error: 'At least one item is required',
    invalid_type_error: 'Items must be an array'
  }).min(1, 'Please add at least one item to the coasting list'),
  per_plate_cost: z.number({
    required_error: 'Per plate cost is required',
    invalid_type_error: 'Per plate cost must be a number'
  }).min(0, 'Per plate cost cannot be negative'),
  selling_price: z.number({
    required_error: 'Selling price is required',
    invalid_type_error: 'Selling price must be a number'
  }).min(0, 'Selling price cannot be negative'),
  profit: z.number({
    invalid_type_error: 'Profit must be a number'
  }).optional(),
  bombay_boys: z.number({
    invalid_type_error: 'Bombay boys count must be a number'
  }).optional(),
  packed_bottles: z.number({
    invalid_type_error: 'Packed bottles count must be a number'
  }).optional(),
})

export const coastingSearchSchema = z.object({
  page: z.number({
    required_error: 'Page number is required',
    invalid_type_error: 'Page must be a number'
  }).min(1, 'Page number must be at least 1').default(1),
  limit: z.number({
    required_error: 'Page limit is required',
    invalid_type_error: 'Limit must be a number'
  }).min(1, 'Page limit must be at least 1')
    .max(100, 'Page limit cannot exceed 100')
    .default(10),
  search: z.string({
    invalid_type_error: 'Search term must be a string'
  }).optional(),
  start_date: z.date({
    invalid_type_error: 'Start date must be a valid date'
  }).refine(isNotFutureDate, {
    message: 'Start date cannot be in the future'
  }).optional(),
  end_date: z.date({
    invalid_type_error: 'End date must be a valid date'
  }).refine(isNotFutureDate, {
    message: 'End date cannot be in the future'
  }).optional(),
  client_id: z.string({
    invalid_type_error: 'Client ID must be a string'
  }).optional(),
  package_id: z.string({
    invalid_type_error: 'Package ID must be a string'
  }).optional(),
}) 