import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react"
import type {
  Screen,
  UserData,
  Scores,
  Recommendation,
  AllocationData,
  FinancialGaps,
} from "@/types"
import { INITIAL_USER_DATA } from "@/types"
import {
  calculateFinancialHealthScores,
  generateCurrentPortfolio,
  generateRecommendedPortfolio,
  generateCostAnalysis,
  generateBehavioralAnalysis,
  generateDetailedRecommendations,
  type CurrentPortfolio,
  type RecommendedPortfolio,
  type CostData,
  type BehavioralData,
} from "@/lib/calculations"

interface AppState {
  currentScreen: Screen
  userData: UserData
  scores: Scores | null
  recommendations: Recommendation[]
  currentPortfolio: CurrentPortfolio | null
  recommendedPortfolio: RecommendedPortfolio | null
  costData: CostData | null
  behavioralData: BehavioralData | null
}

type AppAction =
  | { type: "SET_SCREEN"; payload: Screen }
  | { type: "UPDATE_USER_DATA"; payload: Partial<UserData> }
  | { type: "UPDATE_ALLOCATION"; payload: Partial<AllocationData> }
  | { type: "UPDATE_FINANCIAL_GAPS"; payload: Partial<FinancialGaps> }
  | { type: "TOGGLE_GOAL"; payload: string }
  | { type: "SET_SCORES"; payload: Scores }
  | { type: "SET_RECOMMENDATIONS"; payload: Recommendation[] }
  | { type: "SET_CURRENT_PORTFOLIO"; payload: CurrentPortfolio }
  | { type: "SET_RECOMMENDED_PORTFOLIO"; payload: RecommendedPortfolio }
  | { type: "SET_COST_DATA"; payload: CostData }
  | { type: "SET_BEHAVIORAL_DATA"; payload: BehavioralData }
  | { type: "RESET" }

const initialState: AppState = {
  currentScreen: "welcome",
  userData: INITIAL_USER_DATA,
  scores: null,
  recommendations: [],
  currentPortfolio: null,
  recommendedPortfolio: null,
  costData: null,
  behavioralData: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, currentScreen: action.payload }

    case "UPDATE_USER_DATA":
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
      }

    case "UPDATE_ALLOCATION":
      return {
        ...state,
        userData: {
          ...state.userData,
          allocation: { ...state.userData.allocation, ...action.payload },
        },
      }

    case "UPDATE_FINANCIAL_GAPS":
      return {
        ...state,
        userData: {
          ...state.userData,
          financialGaps: { ...state.userData.financialGaps, ...action.payload },
        },
      }

    case "TOGGLE_GOAL": {
      const goals = state.userData.goals.includes(action.payload)
        ? state.userData.goals.filter((g) => g !== action.payload)
        : [...state.userData.goals, action.payload]
      return {
        ...state,
        userData: { ...state.userData, goals },
      }
    }

    case "SET_SCORES":
      return { ...state, scores: action.payload }

    case "SET_RECOMMENDATIONS":
      return { ...state, recommendations: action.payload }

    case "SET_CURRENT_PORTFOLIO":
      return { ...state, currentPortfolio: action.payload }

    case "SET_RECOMMENDED_PORTFOLIO":
      return { ...state, recommendedPortfolio: action.payload }

    case "SET_COST_DATA":
      return { ...state, costData: action.payload }

    case "SET_BEHAVIORAL_DATA":
      return { ...state, behavioralData: action.payload }

    case "RESET":
      return initialState

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: Dispatch<AppAction>
  goToScreen: (screen: Screen) => void
  goNext: () => void
  goBack: () => void
  calculateResults: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const SCREEN_ORDER: Screen[] = [
  "welcome",
  "basicInfo",
  "goalsTimeline",
  "investmentSnapshot",
  "behavioralAssessment",
  "financialGaps",
  "biggestConcern",
  "processing",
  "results",
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const goToScreen = (screen: Screen) => {
    dispatch({ type: "SET_SCREEN", payload: screen })
  }

  const goNext = () => {
    const currentIndex = SCREEN_ORDER.indexOf(state.currentScreen)
    if (currentIndex < SCREEN_ORDER.length - 1) {
      goToScreen(SCREEN_ORDER[currentIndex + 1])
    }
  }

  const goBack = () => {
    const currentIndex = SCREEN_ORDER.indexOf(state.currentScreen)
    if (currentIndex > 0) {
      goToScreen(SCREEN_ORDER[currentIndex - 1])
    }
  }

  const calculateResults = () => {
    const userData = state.userData

    // Calculate financial health scores
    const scores = calculateFinancialHealthScores(userData)
    dispatch({ type: "SET_SCORES", payload: scores })

    // Generate current portfolio analysis
    const currentPortfolio = generateCurrentPortfolio(userData)
    dispatch({ type: "SET_CURRENT_PORTFOLIO", payload: currentPortfolio })

    // Generate recommended portfolio
    const recommendedPortfolio = generateRecommendedPortfolio(userData)
    dispatch({ type: "SET_RECOMMENDED_PORTFOLIO", payload: recommendedPortfolio })

    // Generate cost analysis
    const costData = generateCostAnalysis(userData)
    dispatch({ type: "SET_COST_DATA", payload: costData })

    // Generate behavioral analysis
    const behavioralData = generateBehavioralAnalysis(userData)
    dispatch({ type: "SET_BEHAVIORAL_DATA", payload: behavioralData })

    // Generate personalized recommendations
    const recommendations = generateDetailedRecommendations(
      userData,
      scores,
      costData,
      behavioralData
    )
    dispatch({ type: "SET_RECOMMENDATIONS", payload: recommendations })
  }

  return (
    <AppContext.Provider
      value={{ state, dispatch, goToScreen, goNext, goBack, calculateResults }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

// Re-export types for convenience
export type { CurrentPortfolio, RecommendedPortfolio, CostData, BehavioralData }
