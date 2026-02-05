import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, PieChart, Percent, UserCheck, TrendingUp, Landmark, Banknote, MoreHorizontal, Globe } from "lucide-react"
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { SelectionButton } from "@/components/shared/SelectionButton"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/context/AppContext"
import { INVESTMENT_OPTIONS, EXPENSE_RATIO_OPTIONS, ADVISOR_FEE_OPTIONS } from "@/types"

const ALLOCATION_CONFIG = [
  { key: "stocks" as const, label: "Stocks", color: "#6366f1", icon: TrendingUp, description: "Equities & index funds" },
  { key: "bonds" as const, label: "Bonds", color: "#8b5cf6", icon: Landmark, description: "Fixed income" },
  { key: "cash" as const, label: "Cash", color: "#10b981", icon: Banknote, description: "Savings & money market" },
  { key: "other" as const, label: "Other", color: "#f59e0b", icon: MoreHorizontal, description: "Real estate, crypto, etc." },
]

export function InvestmentSnapshot() {
  const { state, dispatch, goNext, goBack } = useApp()
  const { userData } = state
  const [step, setStep] = useState(0)

  const handleInvestmentSelect = (totalInvested: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { totalInvested } })
  }

  const handleAllocationChange = (
    type: "stocks" | "bonds" | "cash",
    value: number
  ) => {
    const allocation = { ...userData.allocation }
    allocation[type] = value
    allocation.other = Math.max(0, 100 - allocation.stocks - allocation.bonds - allocation.cash)

    if (allocation.other < 0) {
      allocation[type] = value + allocation.other
      allocation.other = 0
    }

    dispatch({ type: "UPDATE_ALLOCATION", payload: allocation })
  }

  const handleExpenseRatioSelect = (expenseRatio: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { expenseRatio } })
  }

  const handleAdvisorSelect = (hasAdvisor: boolean) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { hasAdvisor } })
    if (!hasAdvisor) {
      dispatch({ type: "UPDATE_USER_DATA", payload: { advisorFee: "" } })
    }
  }

  const handleAdvisorFeeSelect = (advisorFee: string) => {
    dispatch({ type: "UPDATE_USER_DATA", payload: { advisorFee } })
  }

  const pieData = [
    { name: "Stocks", value: userData.allocation.stocks, color: "#6366f1" },
    { name: "Bonds", value: userData.allocation.bonds, color: "#8b5cf6" },
    { name: "Cash", value: userData.allocation.cash, color: "#10b981" },
    { name: "Other", value: userData.allocation.other, color: "#f59e0b" },
  ].filter((d) => d.value > 0)

  const canProceed = () => {
    switch (step) {
      case 0:
        return userData.totalInvested !== ""
      case 1:
        return true
      case 2:
        return userData.expenseRatio !== ""
      case 3:
        return !userData.hasAdvisor || userData.advisorFee !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < 3) {
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

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="total"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
              <PieChart className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
            </div>
            <p className="text-slate-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Approximately how much do you have invested?
            </p>
            <div className="space-y-2 sm:space-y-3">
              {INVESTMENT_OPTIONS.map((option) => (
                <SelectionButton
                  key={option.value}
                  label={option.label}
                  selected={userData.totalInvested === option.value}
                  onClick={() => handleInvestmentSelect(option.value)}
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="allocation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                <PieChart className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <p className="text-slate-600 text-sm sm:text-base">
                What's your approximate asset allocation?
              </p>
            </div>

            {/* Mobile-first Layout: Sliders first, then pie chart */}
            <div className="space-y-4 sm:space-y-6">
              {/* Allocation Sliders - Full width, stacked vertically */}
              <div className="space-y-3 sm:space-y-4">
                {ALLOCATION_CONFIG.slice(0, 3).map((item) => {
                  const Icon = item.icon
                  const value = userData.allocation[item.key]
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100"
                    >
                      {/* Row: Icon + Label + Percentage */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon className="w-5 h-5 sm:w-5 sm:h-5" style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-800 text-sm sm:text-base block">
                            {item.label}
                          </span>
                          <p className="text-xs text-slate-500 truncate">{item.description}</p>
                        </div>
                        <div
                          className="text-xl sm:text-2xl font-bold tabular-nums flex-shrink-0"
                          style={{ color: item.color }}
                        >
                          {value}%
                        </div>
                      </div>

                      {/* Slider - Full width below the label row */}
                      <div className="px-1">
                        <Slider
                          value={[value]}
                          onValueChange={(v) => handleAllocationChange(item.key, v[0])}
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </motion.div>
                  )
                })}

                {/* Other allocation (read-only, shows when > 0) */}
                {userData.allocation.other > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center bg-amber-100 flex-shrink-0">
                        <MoreHorizontal className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-amber-800 text-sm sm:text-base block">Other</span>
                        <p className="text-xs text-amber-600">Remaining allocation</p>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold tabular-nums text-amber-600 flex-shrink-0">
                        {userData.allocation.other}%
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Total indicator */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <span className="font-medium text-indigo-700 text-sm sm:text-base">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-indigo-600">
                    {userData.allocation.stocks + userData.allocation.bonds + userData.allocation.cash + userData.allocation.other}%
                  </span>
                </div>
              </div>

              {/* Pie Chart - Full width on mobile, below sliders */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                <h3 className="text-center font-semibold text-slate-700 mb-3 sm:mb-4 text-sm sm:text-base">
                  Your Portfolio Mix
                </h3>

                {/* Pie Chart - Responsive size */}
                <div className="h-44 sm:h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="45%"
                        outerRadius="75%"
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={500}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend - Grid on mobile */}
                <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-4">
                  {pieData.map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-2 sm:px-3 sm:py-2 shadow-sm border border-slate-100"
                    >
                      <div
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs sm:text-sm text-slate-600 truncate">{item.name}</span>
                      <span
                        className="text-xs sm:text-sm font-bold ml-auto"
                        style={{ color: item.color }}
                      >
                        {item.value}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
              <Percent className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <p className="text-slate-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              What's the average expense ratio of your investments?
            </p>
            <div className="space-y-2 sm:space-y-3">
              {EXPENSE_RATIO_OPTIONS.map((option) => (
                <SelectionButton
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={userData.expenseRatio === option.value}
                  onClick={() => handleExpenseRatioSelect(option.value)}
                  variant="compact"
                />
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="advisor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
              <UserCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <p className="text-slate-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
              Do you work with a financial advisor?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <SelectionButton
                label="Yes"
                selected={userData.hasAdvisor}
                onClick={() => handleAdvisorSelect(true)}
              />
              <SelectionButton
                label="No"
                selected={!userData.hasAdvisor && userData.expenseRatio !== ""}
                onClick={() => handleAdvisorSelect(false)}
              />
            </div>

            {userData.hasAdvisor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 sm:space-y-3"
              >
                <p className="text-slate-600 text-center mb-3 sm:mb-4 text-sm sm:text-base">
                  What do they charge?
                </p>
                {ADVISOR_FEE_OPTIONS.map((option) => (
                  <SelectionButton
                    key={option.value}
                    label={option.label}
                    selected={userData.advisorFee === option.value}
                    onClick={() => handleAdvisorFeeSelect(option.value)}
                    variant="compact"
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <QuestionLayout
      title="Your Investment Snapshot"
      subtitle="Help us understand your current portfolio"
      currentStep={3}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        {renderStep()}

        <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack} className="min-w-[100px] sm:min-w-[120px]">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()} className="min-w-[100px] sm:min-w-[120px]">
            <span className="text-sm sm:text-base">{step < 3 ? "Continue" : "Next"}</span>
            <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
