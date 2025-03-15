// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat().format(number);
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function permissions() {
  const token = localStorage.getItem('auth_token') || null;
  const user = localStorage.getItem('user') || null;
  const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development'

  if (token && user && !isDev){
    return true
  }else{
    return false
  }
}

export function recentData(items:[]){
  if(items.length > 6){
    return items.slice(-6).reverse()
  }else{
    return items.reverse()
  }
}

export function parse(str:string){
  const hashname = str.split('uploads/')[1]
  return hashname.slice(36)
}