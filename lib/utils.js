import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function setLatestCourse(arr, element) {
  const index = arr.indexOf(element);
  
  if (index === -1 || index === 0) {
    return arr;
  }

  arr.splice(index, 1);
  arr.unshift(element);

  return arr;
}