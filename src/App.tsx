import { AnimatePresence } from "framer-motion"
import { AppProvider, useApp } from "@/context/AppContext"
import { Welcome } from "@/components/Welcome"
import { BasicInfo } from "@/components/questions/BasicInfo"
import { GoalsTimeline } from "@/components/questions/GoalsTimeline"
import { InvestmentSnapshot } from "@/components/questions/InvestmentSnapshot"
import { BehavioralAssessment } from "@/components/questions/BehavioralAssessment"
import { FinancialGaps } from "@/components/questions/FinancialGaps"
import { BiggestConcern } from "@/components/questions/BiggestConcern"
import { Processing } from "@/components/Processing"
import { ResultsDashboard } from "@/components/results/ResultsDashboard"

function AppContent() {
  const { state } = useApp()

  const renderScreen = () => {
    switch (state.currentScreen) {
      case "welcome":
        return <Welcome />
      case "basicInfo":
        return <BasicInfo />
      case "goalsTimeline":
        return <GoalsTimeline />
      case "investmentSnapshot":
        return <InvestmentSnapshot />
      case "behavioralAssessment":
        return <BehavioralAssessment />
      case "financialGaps":
        return <FinancialGaps />
      case "biggestConcern":
        return <BiggestConcern />
      case "processing":
        return <Processing />
      case "results":
        return <ResultsDashboard />
      default:
        return <Welcome />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <div key={state.currentScreen}>{renderScreen()}</div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
