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
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        {step === 0 ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Target className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goal.icon
                return (
                  <motion.button
                    key={goal.value}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGoalToggle(goal.value)}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[72px] sm:min-h-[80px] select-none ${
                      userData.goals.includes(goal.value)
                        ? "border-indigo-500 bg-indigo-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-slate-300 active:bg-slate-50"
                    }`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1.5 sm:mb-2 ${goal.color}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`font-medium text-xs sm:text-sm block leading-tight ${
                      userData.goals.includes(goal.value) ? "text-indigo-900" : "text-slate-700"
                    }`}>
                      {goal.label}
                    </span>
                    {userData.goals.includes(goal.value) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-indigo-50 rounded-xl"
              >
                <p className="text-xs sm:text-sm text-indigo-700">
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
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <div className="space-y-2 sm:space-y-3">
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
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-orange-50 rounded-xl"
              >
                <p className="text-xs sm:text-sm text-orange-700">
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

        <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack} className="min-w-[100px] sm:min-w-[120px]">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()} className="min-w-[100px] sm:min-w-[120px]">
            <span className="text-sm sm:text-base">{step === 0 ? "Continue" : "Next"}</span>
            <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
