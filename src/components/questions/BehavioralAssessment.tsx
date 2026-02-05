import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Activity, AlertTriangle, Eye } from "lucide-react"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { SelectionButton } from "@/components/shared/SelectionButton"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import {
  TRADING_FREQUENCY_OPTIONS,
  PANIC_SELLING_OPTIONS,
  CHECKING_FREQUENCY_OPTIONS,
} from "@/types"

export function BehavioralAssessment() {
  const { state, dispatch, goNext, goBack } = useApp()
  const { userData } = state
  const [step, setStep] = useState(0)

  const handleTradingSelect = (tradingFrequency: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { tradingFrequency } })
  }

  const handlePanicSelect = (panicSelling: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { panicSelling } })
  }

  const handleCheckingSelect = (checkingFrequency: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { checkingFrequency } })
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return userData.tradingFrequency !== ""
      case 1:
        return userData.panicSelling !== ""
      case 2:
        return userData.checkingFrequency !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      goNext()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      goBack()
    }
  }

  const getBehavioralInsight = () => {
    if (step === 0 && userData.tradingFrequency) {
      const insights: Record<string, string> = {
        rarely:
          "Buy-and-hold is statistically the most successful strategy for long-term investors.",
        occasionally:
          "Occasional rebalancing is healthy, but try to avoid reacting to short-term market moves.",
        monthly:
          "Monthly trading can increase costs and taxes while often hurting returns.",
        weekly:
          "Frequent trading typically leads to lower returns due to costs and emotional decisions.",
      }
      return insights[userData.tradingFrequency]
    }
    if (step === 1 && userData.panicSelling) {
      const insights: Record<string, string> = {
        never:
          "Staying the course through volatility is one of the most important investing skills.",
        once:
          "It's natural to feel fear during crashes, but missing just a few recovery days can significantly hurt returns.",
        sometimes:
          "Selling during downturns locks in losses. The market has recovered from every crash.",
        often:
          "Emotional selling is the biggest destroyer of investor returns. A written plan can help.",
      }
      return insights[userData.panicSelling]
    }
    if (step === 2 && userData.checkingFrequency) {
      const insights: Record<string, string> = {
        yearly:
          "Periodic reviews are ideal. You're avoiding the anxiety of daily fluctuations.",
        quarterly:
          "Quarterly check-ins are a good balance between staying informed and avoiding overreaction.",
        monthly:
          "Monthly reviews are fine, but avoid making changes based on short-term performance.",
        weekly:
          "Checking weekly can lead to unnecessary anxiety and temptation to trade.",
        daily:
          "Daily checking often increases anxiety and trading urges, both of which hurt returns.",
      }
      return insights[userData.checkingFrequency]
    }
    return null
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="trading"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <p className="text-slate-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              How often do you make changes to your investments?
            </p>
            <div className="space-y-2 sm:space-y-3">
              {TRADING_FREQUENCY_OPTIONS.map((option) => (
                <SelectionButton
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={userData.tradingFrequency === option.value}
                  onClick={() => handleTradingSelect(option.value)}
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="panic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />
            </div>
            <p className="text-slate-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Have you ever sold investments during a market downturn out of fear?
            </p>
            <div className="space-y-2 sm:space-y-3">
              {PANIC_SELLING_OPTIONS.map((option) => (
                <SelectionButton
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={userData.panicSelling === option.value}
                  onClick={() => handlePanicSelect(option.value)}
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="checking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <p className="text-slate-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              How often do you check your investment accounts?
            </p>
            <div className="space-y-2 sm:space-y-3">
              {CHECKING_FREQUENCY_OPTIONS.map((option) => (
                <SelectionButton
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={userData.checkingFrequency === option.value}
                  onClick={() => handleCheckingSelect(option.value)}
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const insight = getBehavioralInsight()

  return (
    <QuestionLayout
      title="Your Investment Behavior"
      subtitle="These habits have a big impact on long-term returns"
      currentStep={4}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        {renderStep()}

        {insight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <p className="text-xs sm:text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Insight: </span>
              {insight}
            </p>
          </motion.div>
        )}

        <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack} className="min-w-[100px] sm:min-w-[120px]">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()} className="min-w-[100px] sm:min-w-[120px]">
            <span className="text-sm sm:text-base">{step < 2 ? "Continue" : "Next"}</span>
            <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
