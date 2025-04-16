import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function tryCatch(fn, errorHandler) {
  try {
    const value = await fn()
    return { success: true, value }
  }
  catch (error) {
    const processedError = errorHandler ? errorHandler(error) : error
    return { success: false, error: processedError }
  }
}
