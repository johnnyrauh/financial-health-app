import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight, AlertTriangle, CheckCircle } from "lucide-react"
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
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-green-50 rounded-2xl p-6 text-center border border-green-200"
        >
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Your Portfolio Looks Good!
          </h3>
          <p className="text-green-700">
            Your current allocation is well-suited for your age and goals.
          </p>
        </motion.div>
      </div>
    )
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
        {/* Issues Alert */}
        {currentPortfolio.issues.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Issues Identified</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {currentPortfolio.issues.map((issue, i) => (
                    <li key={i}>• {issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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

        {/* Benefits */}
        {recommendedPortfolio.benefits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <h4 className="font-semibold text-green-800 mb-2">Benefits of this allocation:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommendedPortfolio.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {benefit}
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
            className="mt-6 p-4 bg-indigo-50 rounded-xl"
          >
            <h4 className="font-semibold text-indigo-800 mb-3">Recommended Low-Cost Funds:</h4>
            <div className="grid gap-2">
              {recommendedPortfolio.recommendedFunds.map((fund) => (
                <div
                  key={fund.ticker}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100"
                >
                  <div>
                    <span className="font-mono font-semibold text-indigo-600">{fund.ticker}</span>
                    <span className="text-slate-600 ml-2 text-sm">{fund.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900">{fund.percentage}%</span>
                    <span className="text-slate-500 text-xs ml-2">({fund.expenseRatio}% ER)</span>
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
          className="mt-6 p-4 bg-slate-50 rounded-xl"
        >
          <p className="text-sm text-slate-600 text-center">
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
