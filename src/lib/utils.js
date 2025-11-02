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

export const printPDF = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe)

    iframe.onload = ()=>{
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.error("Error fetching or printing PDF", err);
  }
};


export const printHTML = async (html) => {
  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  } catch (err) {
    console.error("Error fetching or printing HTML", err);
  }
};