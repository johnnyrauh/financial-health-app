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

interface AppState {
  currentScreen: Screen
  userData: UserData
  scores: Scores | null
  recommendations: Recommendation[]
}

type AppAction =
  | { type: "SET_SCREEN"; payload: Screen }
  | { type: "UPDATE_USER_DATA"; payload: Partial<UserData> }
  | { type: "UPDATE_ALLOCATION"; payload: Partial<AllocationData> }
  | { type: "UPDATE_FINANCIAL_GAPS"; payload: Partial<FinancialGaps> }
  | { type: "TOGGLE_GOAL"; payload: string }
  | { type: "SET_SCORES"; payload: Scores }
  | { type: "SET_RECOMMENDATIONS"; payload: Recommendation[] }
  | { type: "RESET" }

const initialState: AppState = {
  currentScreen: "welcome",
  userData: INITIAL_USER_DATA,
  scores: null,
  recommendations: [],
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

  return (
    <AppContext.Provider value={{ state, dispatch, goToScreen, goNext, goBack }}>
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
