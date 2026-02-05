import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight } from "lucide-react"
import type { AllocationData } from "@/types"

interface PortfolioComparisonProps {
  currentAllocation: AllocationData
  age: number
  retirementTimeline: string
}

const COLORS = {
  stocks: "#6366f1",
  bonds: "#8b5cf6",
  cash: "#10b981",
  other: "#f59e0b",
}

export function PortfolioComparison({
  currentAllocation,
  age,
  retirementTimeline,
}: PortfolioComparisonProps) {
  // Calculate recommended allocation based on age and timeline
  const getRecommendedAllocation = (): AllocationData => {
    let stockPercent: number

    switch (retirementTimeline) {
      case "under-5":
        stockPercent = 40
        break
      case "5-10":
        stockPercent = 50
        break
      case "10-20":
        stockPercent = 65
        break
      case "20-30":
        stockPercent = 80
        break
      case "30-plus":
        stockPercent = 90
        break
      default:
        stockPercent = Math.max(20, Math.min(90, 110 - age))
    }

    return {
      stocks: stockPercent,
      bonds: Math.round((100 - stockPercent) * 0.8),
      cash: Math.round((100 - stockPercent) * 0.2),
      other: 0,
    }
  }

  const recommended = getRecommendedAllocation()

  const currentData = [
    { name: "Stocks", value: currentAllocation.stocks, color: COLORS.stocks },
    { name: "Bonds", value: currentAllocation.bonds, color: COLORS.bonds },
    { name: "Cash", value: currentAllocation.cash, color: COLORS.cash },
    { name: "Other", value: currentAllocation.other, color: COLORS.other },
  ].filter((d) => d.value > 0)

  const recommendedData = [
    { name: "Stocks", value: recommended.stocks, color: COLORS.stocks },
    { name: "Bonds", value: recommended.bonds, color: COLORS.bonds },
    { name: "Cash", value: recommended.cash, color: COLORS.cash },
  ].filter((d) => d.value > 0)

  // Check if current allocation is already close to recommended
  const stockDiff = Math.abs(currentAllocation.stocks - recommended.stocks)
  const isAlreadyOptimal = stockDiff <= 10 && currentAllocation.cash <= 15

  if (isAlreadyOptimal) {
    return null // Don't show comparison if already optimal
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Portfolio Comparison
        </h2>
        <p className="text-slate-600">
          Your current allocation vs. our recommendation for your profile
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Current Allocation */}
          <div>
            <h3 className="text-center font-semibold text-slate-700 mb-4">
              Current Allocation
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {currentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {currentData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 text-xs text-slate-600"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="w-6 h-6 text-indigo-600" />
            </motion.div>
          </div>

          {/* Recommended Allocation */}
          <div>
            <h3 className="text-center font-semibold text-green-700 mb-4">
              Recommended Allocation
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recommendedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {recommendedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {recommendedData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 text-xs text-slate-600"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-indigo-50 rounded-xl"
        >
          <p className="text-sm text-indigo-700 text-center">
            <span className="font-semibold">Why this allocation?</span>
            {" "}
            Based on your age ({age}) and retirement timeline ({retirementTimeline.replace("-", " ")}),
            we recommend {recommended.stocks}% in stocks for long-term growth with {recommended.bonds}% in bonds for stability.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
