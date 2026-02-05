import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Target, Clock, Home, GraduationCap, Plane, Shield, TrendingUp, Sunset } from "lucide-react"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { SelectionButton } from "@/components/shared/SelectionButton"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import { RETIREMENT_OPTIONS } from "@/types"
import { useState } from "react"

const GOAL_OPTIONS = [
  { value: "retirement", label: "Retirement", icon: Sunset, color: "bg-orange-100 text-orange-600" },
  { value: "house", label: "Buy a Home", icon: Home, color: "bg-blue-100 text-blue-600" },
  { value: "education", label: "Children's Education", icon: GraduationCap, color: "bg-purple-100 text-purple-600" },
  { value: "travel", label: "Travel", icon: Plane, color: "bg-cyan-100 text-cyan-600" },
  { value: "emergency", label: "Emergency Fund", icon: Shield, color: "bg-green-100 text-green-600" },
  { value: "wealth", label: "Build Wealth", icon: TrendingUp, color: "bg-indigo-100 text-indigo-600" },
]

export function GoalsTimeline() {
  const { state, dispatch, goNext, goBack } = useApp()
  const { userData } = state
  const [step, setStep] = useState(0)

  const handleGoalToggle = (goal: string) => {
    dispatch({ type: "TOGGLE_GOAL", payload: goal })
  }

  const handleTimelineSelect = (timeline: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { retirementTimeline: timeline } })
  }

  const canProceed = () => {
    if (step === 0) {
      return userData.goals.length > 0
    }
    return userData.retirementTimeline !== ""
  }

  const handleNext = () => {
    if (step === 0) {
      setStep(1)
    } else {
      goNext()
    }
  }

  const handleBack = () => {
    if (step === 0) {
      goBack()
    } else {
      setStep(0)
    }
  }

  return (
    <QuestionLayout
      title={step === 0 ? "What are your financial goals?" : "When do you plan to retire?"}
      subtitle={step === 0 ? "Select all that apply" : "This helps us tailor your investment strategy"}
      currentStep={2}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {step === 0 ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goal.icon
                return (
                  <motion.button
                    key={goal.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGoalToggle(goal.value)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      userData.goals.includes(goal.value)
                        ? "border-indigo-500 bg-indigo-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${goal.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-medium ${
                      userData.goals.includes(goal.value) ? "text-indigo-900" : "text-slate-700"
                    }`}>
                      {goal.label}
                    </span>
                    {userData.goals.includes(goal.value) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {userData.goals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-indigo-50 rounded-xl"
              >
                <p className="text-sm text-indigo-700">
                  <span className="font-semibold">{userData.goals.length}</span> goal{userData.goals.length > 1 ? "s" : ""} selected
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="space-y-3">
              {RETIREMENT_OPTIONS.map((option) => (
                <SelectionButton
                  key={option.value}
                  label={option.label}
                  selected={userData.retirementTimeline === option.value}
                  onClick={() => handleTimelineSelect(option.value)}
                  variant="compact"
                />
              ))}
            </div>

            {userData.retirementTimeline && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-orange-50 rounded-xl"
              >
                <p className="text-sm text-orange-700">
                  {userData.retirementTimeline === "under-5"
                    ? "With retirement near, we'll focus on capital preservation and income."
                    : userData.retirementTimeline === "30-plus"
                    ? "With a long time horizon, growth-focused strategies make sense."
                    : "We'll balance growth with appropriate risk management."}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === 0 ? "Continue" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
