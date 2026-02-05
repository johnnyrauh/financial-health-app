export interface AllocationData {
  stocks: number
  bonds: number
  cash: number
  other: number
}

export interface FinancialGaps {
  emergencyFund: boolean
  lifeInsurance: boolean
  disabilityInsurance: boolean
  estatePlan: boolean
  collegesSavings: boolean
}

export interface UserData {
  name: string
  age: number
  income: string
  hasChildren: boolean
  numberOfChildren: number
  goals: string[]
  retirementTimeline: string
  totalInvested: string
  allocation: AllocationData
  expenseRatio: string
  hasAdvisor: boolean
  advisorFee: string
  tradingFrequency: string
  panicSelling: string
  checkingFrequency: string
  financialGaps: FinancialGaps
  biggestConcern: string
}

export interface Scores {
  overall: number
  investmentStrategy: number
  costEfficiency: number
  taxOptimization: number
  behavioralHealth: number
  goalCoverage: number
}

export interface Recommendation {
  id: string
  title: string
  category: string
  priority: "high" | "medium" | "low"
  currentState: string
  recommendedState: string
  dollarImpact: number
  impactDescription: string
  steps: RecommendationStep[]
  explanation: string
}

export interface RecommendationStep {
  title: string
  description: string
  link?: string
}

export type Screen =
  | "welcome"
  | "basicInfo"
  | "goalsTimeline"
  | "investmentSnapshot"
  | "behavioralAssessment"
  | "financialGaps"
  | "biggestConcern"
  | "processing"
  | "results"

export interface AppState {
  currentScreen: Screen
  userData: UserData
  scores: Scores | null
  recommendations: Recommendation[]
}

export const INITIAL_USER_DATA: UserData = {
  name: "",
  age: 35,
  income: "",
  hasChildren: false,
  numberOfChildren: 0,
  goals: [],
  retirementTimeline: "",
  totalInvested: "",
  allocation: {
    stocks: 60,
    bonds: 30,
    cash: 10,
    other: 0,
  },
  expenseRatio: "",
  hasAdvisor: false,
  advisorFee: "",
  tradingFrequency: "",
  panicSelling: "",
  checkingFrequency: "",
  financialGaps: {
    emergencyFund: false,
    lifeInsurance: false,
    disabilityInsurance: false,
    estatePlan: false,
    collegesSavings: false,
  },
  biggestConcern: "",
}

export const INCOME_OPTIONS = [
  { value: "under-50k", label: "Under $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-200k", label: "$100,000 - $200,000" },
  { value: "200k-500k", label: "$200,000 - $500,000" },
  { value: "500k-plus", label: "$500,000+" },
]

export const INVESTMENT_OPTIONS = [
  { value: "under-10k", label: "Under $10,000" },
  { value: "10k-50k", label: "$10,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-500k", label: "$100,000 - $500,000" },
  { value: "500k-1m", label: "$500,000 - $1,000,000" },
  { value: "1m-plus", label: "$1,000,000+" },
]

export const GOAL_OPTIONS = [
  { value: "retirement", label: "Retirement", icon: "Sunset" },
  { value: "house", label: "Buy a Home", icon: "Home" },
  { value: "education", label: "Children's Education", icon: "GraduationCap" },
  { value: "travel", label: "Travel", icon: "Plane" },
  { value: "emergency", label: "Emergency Fund", icon: "Shield" },
  { value: "wealth", label: "Build Wealth", icon: "TrendingUp" },
]

export const RETIREMENT_OPTIONS = [
  { value: "under-5", label: "Less than 5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10-20", label: "10-20 years" },
  { value: "20-30", label: "20-30 years" },
  { value: "30-plus", label: "30+ years" },
]

export const EXPENSE_RATIO_OPTIONS = [
  { value: "under-0.1", label: "Under 0.1%", description: "Index funds, ETFs" },
  { value: "0.1-0.5", label: "0.1% - 0.5%", description: "Low-cost funds" },
  { value: "0.5-1", label: "0.5% - 1.0%", description: "Average funds" },
  { value: "over-1", label: "Over 1.0%", description: "High-cost funds" },
  { value: "unknown", label: "I don't know", description: "Need to check" },
]

export const ADVISOR_FEE_OPTIONS = [
  { value: "under-0.5", label: "Under 0.5%" },
  { value: "0.5-1", label: "0.5% - 1.0%" },
  { value: "1-1.5", label: "1.0% - 1.5%" },
  { value: "over-1.5", label: "Over 1.5%" },
  { value: "flat-fee", label: "Flat fee" },
  { value: "unknown", label: "I don't know" },
]

export const TRADING_FREQUENCY_OPTIONS = [
  { value: "rarely", label: "Rarely", description: "Buy and hold, rebalance annually" },
  { value: "occasionally", label: "Occasionally", description: "A few times per year" },
  { value: "monthly", label: "Monthly", description: "Make changes monthly" },
  { value: "weekly", label: "Weekly or more", description: "Active trading" },
]

export const PANIC_SELLING_OPTIONS = [
  { value: "never", label: "Never", description: "I stay the course" },
  { value: "once", label: "Once or twice", description: "During major downturns" },
  { value: "sometimes", label: "Sometimes", description: "When markets drop 10%+" },
  { value: "often", label: "Often", description: "Any significant decline" },
]

export const CHECKING_FREQUENCY_OPTIONS = [
  { value: "yearly", label: "Yearly or less", description: "Set it and forget it" },
  { value: "quarterly", label: "Quarterly", description: "Review each quarter" },
  { value: "monthly", label: "Monthly", description: "Check monthly" },
  { value: "weekly", label: "Weekly", description: "Check weekly" },
  { value: "daily", label: "Daily or more", description: "Check constantly" },
]
