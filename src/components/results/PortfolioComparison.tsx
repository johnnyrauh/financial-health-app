import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight, ArrowDown, AlertTriangle, CheckCircle } from "lucide-react"
import type { CurrentPortfolio, RecommendedPortfolio } from "@/context/AppContext"

interface PortfolioComparisonProps {
  currentPortfolio: CurrentPortfolio
  recommendedPortfolio: RecommendedPortfolio
  age: number
}

const COLORS = {
  stocks: "#6366f1",
  bonds: "#8b5cf6",
  cash: "#10b981",
  other: "#f59e0b",
}

export function PortfolioComparison({
  currentPortfolio,
  recommendedPortfolio,
  age,
}: PortfolioComparisonProps) {
  const currentData = [
    { name: "Stocks", value: currentPortfolio.stocks, color: COLORS.stocks },
    { name: "Bonds", value: currentPortfolio.bonds, color: COLORS.bonds },
    { name: "Cash", value: currentPortfolio.cash, color: COLORS.cash },
    { name: "Other", value: currentPortfolio.other, color: COLORS.other },
  ].filter((d) => d.value > 0)

  const recommendedData = [
    { name: "Stocks", value: recommendedPortfolio.stocks, color: COLORS.stocks },
    { name: "Bonds", value: recommendedPortfolio.bonds, color: COLORS.bonds },
    { name: "Cash", value: recommendedPortfolio.cash, color: COLORS.cash },
  ].filter((d) => d.value > 0)

  // Check if portfolios are similar
  const stockDiff = Math.abs(currentPortfolio.stocks - recommendedPortfolio.stocks)
  const isAlreadyOptimal = stockDiff <= 10 && currentPortfolio.cash <= 15 && currentPortfolio.issues.length === 0

  if (isAlreadyOptimal) {
    return (
      <div className="py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-green-50 rounded-2xl p-4 sm:p-6 text-center border border-green-200"
        >
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">
            Your Portfolio Looks Good!
          </h3>
          <p className="text-green-700 text-sm sm:text-base">
            Your current allocation is well-suited for your age and goals.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-4 sm:mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Portfolio Comparison
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Your current allocation vs. our recommendation for your profile
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100"
      >
        {/* Issues Alert */}
        {currentPortfolio.issues.length > 0 && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1 text-sm sm:text-base">Issues Identified</h4>
                <ul className="text-xs sm:text-sm text-amber-700 space-y-1">
                  {currentPortfolio.issues.map((issue, i) => (
                    <li key={i}>• {issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Charts - Stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center">
          {/* Current Allocation */}
          <div>
            <h3 className="text-center font-semibold text-slate-700 mb-2 sm:mb-4 text-sm sm:text-base">
              Current Allocation
            </h3>
            <div className="h-36 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    innerRadius="35%"
                    outerRadius="70%"
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
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
              {currentData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-600"
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

          {/* Arrow - Rotates on mobile */}
          <div className="flex justify-center py-2 md:py-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center"
            >
              <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 md:hidden" />
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 hidden md:block" />
            </motion.div>
          </div>

          {/* Recommended Allocation */}
          <div>
            <h3 className="text-center font-semibold text-green-700 mb-2 sm:mb-4 text-sm sm:text-base">
              Recommended Allocation
            </h3>
            <div className="h-36 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recommendedData}
                    cx="50%"
                    cy="50%"
                    innerRadius="35%"
                    outerRadius="70%"
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
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
              {recommendedData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-600"
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

        {/* Benefits */}
        {recommendedPortfolio.benefits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Benefits of this allocation:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {recommendedPortfolio.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-green-700">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Recommended Funds */}
        {recommendedPortfolio.recommendedFunds && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-indigo-50 rounded-xl"
          >
            <h4 className="font-semibold text-indigo-800 mb-2 sm:mb-3 text-sm sm:text-base">Recommended Low-Cost Funds:</h4>
            <div className="grid gap-2">
              {recommendedPortfolio.recommendedFunds.map((fund) => (
                <div
                  key={fund.ticker}
                  className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-indigo-100"
                >
                  <div className="min-w-0">
                    <span className="font-mono font-semibold text-indigo-600 text-sm sm:text-base">{fund.ticker}</span>
                    <span className="text-slate-600 ml-2 text-xs sm:text-sm truncate">{fund.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">{fund.percentage}%</span>
                    <span className="text-slate-500 text-[10px] sm:text-xs ml-1 sm:ml-2">({fund.expenseRatio}% ER)</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-xl"
        >
          <p className="text-xs sm:text-sm text-slate-600 text-center">
            <span className="font-semibold">Why this allocation?</span>
            {" "}
            Based on your age ({age}) and timeline, we recommend {recommendedPortfolio.stocks}% in stocks
            for long-term growth with {recommendedPortfolio.bonds}% in bonds for stability.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
