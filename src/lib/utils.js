import { AxiosError } from "axios";
import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function tryCatch(fn, errorHandler) {
  try {
    const value = await fn();
    console.log(value)
    return { success: true, value };
  } catch (error) {
    const processedError = errorHandler ? errorHandler(error) : error;
    return { success: false, error: processedError };
  }
}

export function responseToaster(response) {
  if (!("data" in response)) return toast.info("No response from server");

  let data = null;

  if (response.data instanceof AxiosError) {
    console.error("axios error");
  } else {
    data = response.data;
  }

  if (!("ResponseCode" in data))
    return toast.info("ResponseCode not found in response");

  if (data.ResponseCode === 0)
    return toast.error(
      data.ResponseMessage || "ResponseMessage not found in response"
    );

  if (data.ResponseCode === 1)
    return toast.success(
      data.ResponseMessage || "ResponseMessage not found in response"
    );
}
