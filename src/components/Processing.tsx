import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Brain, Calculator, LineChart, Shield, Target } from "lucide-react"
import confetti from "canvas-confetti"
import { useApp } from "@/context/AppContext"
import { delay } from "@/lib/utils"

const PROCESSING_STEPS = [
  { icon: Brain, label: "Analyzing your financial profile", color: "text-indigo-600" },
  { icon: Calculator, label: "Calculating investment efficiency", color: "text-purple-600" },
  { icon: LineChart, label: "Evaluating behavioral patterns", color: "text-blue-600" },
  { icon: Shield, label: "Assessing risk coverage", color: "text-green-600" },
  { icon: Target, label: "Generating recommendations", color: "text-orange-600" },
]

export function Processing() {
  const { state, goToScreen } = useApp()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    async function processData() {
      // Animate through steps (calculations already done in BiggestConcern)
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setCurrentStep(i)
        await delay(600 + Math.random() * 300)
        setCompletedSteps((prev) => [...prev, i])
      }

      // Trigger confetti for good scores
      if (state.scores && state.scores.overall >= 70) {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 safe-area-inset">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 relative"
        >
          {/* Spinning loader */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Center icon */}
          <div className="absolute inset-1.5 sm:inset-2 bg-white/20 rounded-full flex items-center justify-center">
            {completedSteps.length === PROCESSING_STEPS.length ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                  return <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                })()}
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-white text-center mb-1 sm:mb-2"
        >
          {completedSteps.length === PROCESSING_STEPS.length
            ? "Analysis Complete!"
            : "Analyzing Your Finances"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-center mb-6 sm:mb-8 text-sm sm:text-base"
        >
          {completedSteps.length === PROCESSING_STEPS.length
            ? "Preparing your personalized results..."
            : "This will just take a moment"}
        </motion.p>

        <div className="space-y-2 sm:space-y-3">
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
                  className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
                    isCompleted
                      ? "bg-white/20"
                      : isCurrent
                      ? "bg-white/10"
                      : "bg-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
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
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </motion.div>
                    ) : (
                      <Icon
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          isCurrent ? "text-white" : "text-white/50"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium flex-1 ${
                      isCompleted || isCurrent
                        ? "text-white"
                        : "text-white/50"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <motion.div
                      className="flex-shrink-0"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
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
