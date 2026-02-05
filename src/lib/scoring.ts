import type { UserData, Scores } from "@/types"

export function calculateScores(userData: UserData): Scores {
  const investmentStrategy = calculateInvestmentStrategy(userData)
  const costEfficiency = calculateCostEfficiency(userData)
  const taxOptimization = calculateTaxOptimization(userData)
  const behavioralHealth = calculateBehavioralHealth(userData)
  const goalCoverage = calculateGoalCoverage(userData)

  // Weighted overall score
  const overall = Math.round(
    investmentStrategy * 0.25 +
    costEfficiency * 0.25 +
    taxOptimization * 0.15 +
    behavioralHealth * 0.2 +
    goalCoverage * 0.15
  )

  return {
    overall,
    investmentStrategy,
    costEfficiency,
    taxOptimization,
    behavioralHealth,
    goalCoverage,
  }
}

function calculateInvestmentStrategy(userData: UserData): number {
  const { age, retirementTimeline, allocation } = userData
  let score = 100

  // Calculate ideal stock allocation based on age (rule of thumb: 110 - age)
  const idealStockAllocation = Math.max(20, Math.min(90, 110 - age))
  const stockDifference = Math.abs(allocation.stocks - idealStockAllocation)

  // Penalize for being too far from ideal
  score -= stockDifference * 0.8

  // Penalize for too much cash (over 15% is generally too high for long-term)
  if (allocation.cash > 15) {
    score -= (allocation.cash - 15) * 1.5
  }

  // Bonus for having some bond allocation (diversification)
  if (allocation.bonds >= 10 && allocation.bonds <= 40) {
    score += 5
  }

  // Adjust based on timeline
  const timelineAdjustments: Record<string, number> = {
    "under-5": allocation.bonds < 40 ? -10 : 5,
    "5-10": allocation.bonds < 30 ? -5 : 3,
    "10-20": 0,
    "20-30": allocation.stocks < 60 ? -5 : 0,
    "30-plus": allocation.stocks < 70 ? -10 : 5,
  }

  score += timelineAdjustments[retirementTimeline] || 0

  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateCostEfficiency(userData: UserData): number {
  const { expenseRatio, hasAdvisor, advisorFee } = userData
  let score = 100

  // Expense ratio scoring
  const expenseRatioScores: Record<string, number> = {
    "under-0.1": 0,
    "0.1-0.5": -10,
    "0.5-1": -25,
    "over-1": -45,
    "unknown": -20,
  }
  score += expenseRatioScores[expenseRatio] || -20

  // Advisor fee scoring
  if (hasAdvisor) {
    const advisorFeeScores: Record<string, number> = {
      "under-0.5": -5,
      "0.5-1": -15,
      "1-1.5": -30,
      "over-1.5": -45,
      "flat-fee": -10,
      "unknown": -25,
    }
    score += advisorFeeScores[advisorFee] || -25
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateTaxOptimization(userData: UserData): number {
  const { income, hasAdvisor } = userData
  let score = 70 // Base score - we assume moderate optimization

  // Higher income = more opportunities for optimization
  const incomeBonus: Record<string, number> = {
    "under-50k": 10,
    "50k-100k": 5,
    "100k-200k": 0,
    "200k-500k": -5,
    "500k-plus": -10,
  }
  score += incomeBonus[income] || 0

  // Having an advisor might mean better tax optimization
  if (hasAdvisor) {
    score += 15
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateBehavioralHealth(userData: UserData): number {
  const { tradingFrequency, panicSelling, checkingFrequency } = userData
  let score = 100

  // Trading frequency scoring
  const tradingScores: Record<string, number> = {
    "rarely": 0,
    "occasionally": -10,
    "monthly": -25,
    "weekly": -40,
  }
  score += tradingScores[tradingFrequency] || -20

  // Panic selling scoring
  const panicScores: Record<string, number> = {
    "never": 0,
    "once": -15,
    "sometimes": -30,
    "often": -50,
  }
  score += panicScores[panicSelling] || -25

  // Checking frequency scoring
  const checkingScores: Record<string, number> = {
    "yearly": 5,
    "quarterly": 0,
    "monthly": -5,
    "weekly": -15,
    "daily": -25,
  }
  score += checkingScores[checkingFrequency] || -10

  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateGoalCoverage(userData: UserData): number {
  const { financialGaps, hasChildren, goals } = userData
  let score = 100
  let requiredItems = 0
  let coveredItems = 0

  // Emergency fund is always required
  requiredItems++
  if (financialGaps.emergencyFund) coveredItems++
  else score -= 25

  // Life insurance important if has dependents
  if (hasChildren || userData.age > 30) {
    requiredItems++
    if (financialGaps.lifeInsurance) coveredItems++
    else score -= 15
  }

  // Estate plan becomes important with age
  if (userData.age > 40) {
    requiredItems++
    if (financialGaps.estatePlan) coveredItems++
    else score -= 10
  }

  // College savings if has children
  if (hasChildren && goals.includes("education")) {
    requiredItems++
    if (financialGaps.collegesSavings) coveredItems++
    else score -= 20
  }

  // Disability insurance for working-age adults
  if (userData.age < 60) {
    requiredItems++
    if (financialGaps.disabilityInsurance) coveredItems++
    else score -= 10
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getScoreCategory(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Needs Attention"
}
