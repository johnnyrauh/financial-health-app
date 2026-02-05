import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Brain, Calculator, LineChart, Shield, Target } from "lucide-react"
import confetti from "canvas-confetti"
import { useApp } from "@/context/AppContext"
import { calculateScores } from "@/lib/scoring"
import { generateRecommendations } from "@/lib/recommendations"
import { delay } from "@/lib/utils"

const PROCESSING_STEPS = [
  { icon: Brain, label: "Analyzing your financial profile", color: "text-indigo-600" },
  { icon: Calculator, label: "Calculating investment efficiency", color: "text-purple-600" },
  { icon: LineChart, label: "Evaluating behavioral patterns", color: "text-blue-600" },
  { icon: Shield, label: "Assessing risk coverage", color: "text-green-600" },
  { icon: Target, label: "Generating recommendations", color: "text-orange-600" },
]

export function Processing() {
  const { state, dispatch, goToScreen } = useApp()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    async function processData() {
      // Simulate processing with step animations
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setCurrentStep(i)
        await delay(800 + Math.random() * 400)
        setCompletedSteps((prev) => [...prev, i])
      }

      // Calculate actual scores
      const scores = calculateScores(state.userData)
      dispatch({ type: "SET_SCORES", payload: scores })

      // Generate recommendations
      const recommendations = generateRecommendations(state.userData, scores)
      dispatch({ type: "SET_RECOMMENDATIONS", payload: recommendations })

      // Trigger confetti for good scores
      if (scores.overall >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }

      // Brief pause to show completion
      await delay(500)

      // Navigate to results
      goToScreen("results")
    }

    processData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 relative"
        >
          {/* Spinning loader */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Center icon */}
          <div className="absolute inset-2 bg-white/20 rounded-full flex items-center justify-center">
            {completedSteps.length === PROCESSING_STEPS.length ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                {(() => {
                  const Icon = PROCESSING_STEPS[currentStep]?.icon || Brain
                  return <Icon className="w-8 h-8 text-white" />
                })()}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white text-center mb-2"
        >
          {completedSteps.length === PROCESSING_STEPS.length
            ? "Analysis Complete!"
            : "Analyzing Your Finances"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-center mb-8"
        >
          {completedSteps.length === PROCESSING_STEPS.length
            ? "Preparing your personalized results..."
            : "This will just take a moment"}
        </motion.p>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {PROCESSING_STEPS.map((step, index) => {
              const Icon = step.icon
              const isCompleted = completedSteps.includes(index)
              const isCurrent = currentStep === index && !isCompleted

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: index <= currentStep ? 1 : 0.4,
                    x: 0,
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCompleted
                      ? "bg-white/20"
                      : isCurrent
                      ? "bg-white/10"
                      : "bg-transparent"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-green-500"
                        : isCurrent
                        ? "bg-white/20"
                        : "bg-white/10"
                    }`}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    ) : (
                      <Icon
                        className={`w-4 h-4 ${
                          isCurrent ? "text-white" : "text-white/50"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent
                        ? "text-white"
                        : "text-white/50"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.div
                      className="ml-auto"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
