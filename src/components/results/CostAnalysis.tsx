import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { DollarSign, TrendingUp, ArrowDown } from "lucide-react"
import CountUp from "react-countup"
import type { CostData } from "@/context/AppContext"

interface CostAnalysisProps {
  costData: CostData
}

export function CostAnalysis({ costData }: CostAnalysisProps) {
  // Convert projection data to chart format
  const chartData = Object.keys(costData.projectionWithCurrentFees)
    .filter((_, i) => i % 5 === 0) // Show every 5 years
    .map((year) => ({
      year: `Year ${year}`,
      current: costData.projectionWithCurrentFees[parseInt(year)],
      recommended: costData.projectionWithRecommendedFees[parseInt(year)],
    }))

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
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
          The Cost of Fees
        </h2>
        <p className="text-slate-600">
          See how much you could save by reducing investment fees
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">Current Fees</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {costData.totalCurrentFees.toFixed(2)}%
            </p>
            <p className="text-sm text-red-600 mt-1">
              ${costData.annualCurrentCost.toLocaleString()}/year
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ArrowDown className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Recommended Fees</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {costData.totalRecommendedFees.toFixed(2)}%
            </p>
            <p className="text-sm text-green-600 mt-1">
              ${costData.annualRecommendedCost.toLocaleString()}/year
            </p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-indigo-700">30-Year Savings</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              $<CountUp end={costData.savings} duration={2} separator="," />
            </p>
            <p className="text-sm text-indigo-600 mt-1">
              Extra in your pocket
            </p>
          </div>
        </div>

        {/* Fee Breakdown Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Fee Type</th>
                <th className="text-center py-3 px-4 font-semibold text-red-600">Current</th>
                <th className="text-center py-3 px-4 font-semibold text-green-600">Recommended</th>
                <th className="text-right py-3 px-4 font-semibold text-indigo-600">Annual Savings</th>
              </tr>
            </thead>
            <tbody>
              {costData.feeBreakdown.map((fee, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900">{fee.type}</p>
                    <p className="text-xs text-slate-500">{fee.description}</p>
                  </td>
                  <td className="text-center py-3 px-4 text-red-600">{fee.current.toFixed(2)}%</td>
                  <td className="text-center py-3 px-4 text-green-600">{fee.recommended.toFixed(2)}%</td>
                  <td className="text-right py-3 px-4 text-indigo-600 font-medium">
                    ${fee.annualSavings.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Projection Chart */}
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                name="With Current Fees"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="recommended"
                name="With Low-Cost Funds"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200"
        >
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Why fees matter so much:</span>{" "}
            Fees compound against you just like returns compound for you. A 1% annual fee
            doesn't sound like much, but over 30 years it can cost you 25% of your total
            portfolio value. This is one of the few things you can control in investing.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
