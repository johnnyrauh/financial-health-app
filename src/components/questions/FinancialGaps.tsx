import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, ClipboardCheck, Wallet, Heart, Umbrella, FileText, GraduationCap } from "lucide-react"
import { QuestionLayout } from "@/components/shared/QuestionLayout"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/context/AppContext"
import type { FinancialGaps as FinancialGapsType } from "@/types"

const GAP_ITEMS = [
  {
    key: "emergencyFund" as keyof FinancialGapsType,
    label: "Emergency Fund",
    description: "3-6 months of expenses in savings",
    icon: Wallet,
    color: "bg-green-100 text-green-600",
  },
  {
    key: "lifeInsurance" as keyof FinancialGapsType,
    label: "Life Insurance",
    description: "Protection for dependents",
    icon: Heart,
    color: "bg-red-100 text-red-600",
  },
  {
    key: "disabilityInsurance" as keyof FinancialGapsType,
    label: "Disability Insurance",
    description: "Income protection if unable to work",
    icon: Umbrella,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "estatePlan" as keyof FinancialGapsType,
    label: "Estate Plan",
    description: "Will, beneficiaries, healthcare directive",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    key: "collegesSavings" as keyof FinancialGapsType,
    label: "College Savings (529)",
    description: "Tax-advantaged education savings",
    icon: GraduationCap,
    color: "bg-orange-100 text-orange-600",
  },
]

export function FinancialGaps() {
  const { state, dispatch, goNext, goBack } = useApp()
  const { userData } = state

  const handleToggle = (key: keyof FinancialGapsType) => {
    dispatch({
      type: "UPDATE_FINANCIAL_GAPS",
      payload: { [key]: !userData.financialGaps[key] },
    })
  }

  const coveredCount = Object.values(userData.financialGaps).filter(Boolean).length
  const totalCount = userData.hasChildren ? 5 : 4 // Don't count college savings if no kids

  return (
    <QuestionLayout
      title="Financial Safety Net"
      subtitle="Check the items you already have in place"
      currentStep={5}
      totalSteps={7}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
          <ClipboardCheck className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="space-y-4">
          {GAP_ITEMS.map((item, index) => {
            // Hide college savings if no children
            if (item.key === "collegesSavings" && !userData.hasChildren) {
              return null
            }

            const Icon = item.icon
            const isChecked = userData.financialGaps[item.key]

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <label
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isChecked
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(item.key)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${
                            isChecked ? "text-indigo-900" : "text-slate-900"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-sm ${
                            isChecked ? "text-indigo-600" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </label>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-slate-50 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Coverage status</span>
            <span className="font-semibold text-indigo-600">
              {coveredCount} of {totalCount} items
            </span>
          </div>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(coveredCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={goNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </QuestionLayout>
  )
}
