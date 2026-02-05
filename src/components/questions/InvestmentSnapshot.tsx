import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, PieChart, Percent, UserCheck } from "lucide-react"
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { SelectionButton } from "@/components/shared/SelectionButton"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/context/AppContext"
import { INVESTMENT_OPTIONS, EXPENSE_RATIO_OPTIONS, ADVISOR_FEE_OPTIONS } from "@/types"

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"]

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

    // Adjust other to maintain 100% total
    allocation[type] = value
    allocation.other = Math.max(0, 100 - allocation.stocks - allocation.bonds - allocation.cash)

    // If other goes negative, we need to reduce one of the others
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
    { name: "Stocks", value: userData.allocation.stocks },
    { name: "Bonds", value: userData.allocation.bonds },
    { name: "Cash", value: userData.allocation.cash },
    { name: "Other", value: userData.allocation.other },
  ].filter((d) => d.value > 0)

  const canProceed = () => {
    switch (step) {
      case 0:
        return userData.totalInvested !== ""
      case 1:
        return true // Allocation always sums to 100
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
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <PieChart className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-slate-600 text-center mb-6">
              Approximately how much do you have invested?
            </p>
            <div className="space-y-3">
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
          >
            <p className="text-slate-600 text-center mb-6">
              What's your approximate asset allocation?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <AllocationSlider
                  label="Stocks"
                  value={userData.allocation.stocks}
                  onChange={(v) => handleAllocationChange("stocks", v)}
                  color="#6366f1"
                />
                <AllocationSlider
                  label="Bonds"
                  value={userData.allocation.bonds}
                  onChange={(v) => handleAllocationChange("bonds", v)}
                  color="#8b5cf6"
                />
                <AllocationSlider
                  label="Cash"
                  value={userData.allocation.cash}
                  onChange={(v) => handleAllocationChange("cash", v)}
                  color="#10b981"
                />
                {userData.allocation.other > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Other</span>
                    <span className="font-semibold text-amber-600">
                      {userData.allocation.other}%
                    </span>
                  </div>
                )}
              </div>

              <div className="h-48 md:h-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
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
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <Percent className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-slate-600 text-center mb-6">
              What's the average expense ratio of your investments?
            </p>
            <div className="space-y-3">
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
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-slate-600 text-center mb-6">
              Do you work with a financial advisor?
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                className="space-y-3"
              >
                <p className="text-slate-600 text-center mb-4">
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
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {renderStep()}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step < 3 ? "Continue" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}

function AllocationSlider({
  label,
  value,
  onChange,
  color,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  color: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-sm font-semibold" style={{ color }}>
          {value}%
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={0}
        max={100}
        step={5}
      />
    </div>
  )
}
