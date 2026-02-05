import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981" // excellent - emerald
  if (score >= 60) return "#22C55E" // good - green
  if (score >= 40) return "#F59E0B" // fair - amber
  return "#EF4444" // poor - red
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Needs Attention"
}

export function parseIncomeRange(income: string): number {
  const ranges: Record<string, number> = {
    "under-50k": 35000,
    "50k-100k": 75000,
    "100k-200k": 150000,
    "200k-500k": 350000,
    "500k-plus": 750000,
  }
  return ranges[income] || 75000
}

export function parseInvestmentRange(investment: string): number {
  const ranges: Record<string, number> = {
    "under-10k": 5000,
    "10k-50k": 30000,
    "50k-100k": 75000,
    "100k-500k": 300000,
    "500k-1m": 750000,
    "1m-plus": 1500000,
  }
  return ranges[investment] || 50000
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
