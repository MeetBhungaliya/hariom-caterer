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

export const printPDF = (pdfUrl) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 100);
  };
  document.body.appendChild(iframe);
};