import { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { RefreshCw } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { HeroScore } from "./HeroScore"
import { CategoryBreakdown } from "./CategoryBreakdown"
import { PriorityActions } from "./PriorityActions"
import { PortfolioComparison } from "./PortfolioComparison"

export function ResultsDashboard() {
  const { state, dispatch, goToScreen } = useApp()
  const { scores, recommendations, userData } = state

  useEffect(() => {
    // Trigger confetti for high scores
    if (scores && scores.overall >= 70) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 500)
    }
  }, [scores])

  if (!scores) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    )
  }

  const handleStartOver = () => {
    dispatch({ type: "RESET" })
    goToScreen("welcome")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg" />
            <span className="font-semibold text-slate-900">
              Financial Health Score
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOver}
              className="hidden sm:flex"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Score Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 mb-8"
        >
          <HeroScore score={scores.overall} name={userData.name} />
        </motion.section>

        {/* Category Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <CategoryBreakdown scores={scores} />
        </motion.section>

        {/* Portfolio Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <PortfolioComparison
            currentAllocation={userData.allocation}
            age={userData.age}
            retirementTimeline={userData.retirementTimeline}
          />
        </motion.section>

        {/* Priority Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <PriorityActions recommendations={recommendations} />
        </motion.section>

        {/* Footer CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to improve your score?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Start with your highest-priority recommendation and work your way down.
            Small changes can lead to big improvements over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-white/90"
              onClick={handleStartOver}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Take Assessment Again
            </Button>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-slate-500"
        >
          This assessment provides general educational information and is not
          financial advice. Consult a qualified financial advisor for
          personalized guidance.
        </motion.p>
      </main>
    </div>
  )
}
