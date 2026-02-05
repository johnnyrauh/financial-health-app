import { motion } from "framer-motion"
import CountUp from "react-countup"
import { TrendingUp, DollarSign, FileText, Brain, Target } from "lucide-react"
import { getScoreColor } from "@/lib/utils"
import type { Scores } from "@/types"

interface CategoryBreakdownProps {
  scores: Scores
}

const CATEGORIES = [
  {
    key: "investmentStrategy" as keyof Scores,
    label: "Investment Strategy",
    description: "Asset allocation and diversification",
    icon: TrendingUp,
    weight: "25%",
  },
  {
    key: "costEfficiency" as keyof Scores,
    label: "Cost Efficiency",
    description: "Fees and expense ratios",
    icon: DollarSign,
    weight: "25%",
  },
  {
    key: "taxOptimization" as keyof Scores,
    label: "Tax Optimization",
    description: "Tax-advantaged account usage",
    icon: FileText,
    weight: "15%",
  },
  {
    key: "behavioralHealth" as keyof Scores,
    label: "Behavioral Health",
    description: "Investment habits and discipline",
    icon: Brain,
    weight: "20%",
  },
  {
    key: "goalCoverage" as keyof Scores,
    label: "Goal Coverage",
    description: "Financial protection and planning",
    icon: Target,
    weight: "15%",
  },
]

export function CategoryBreakdown({ scores }: CategoryBreakdownProps) {
  return (
    <div className="py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-slate-900 text-center mb-2"
      >
        Score Breakdown
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-slate-600 text-center mb-8"
      >
        How you performed in each category
      </motion.p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, index) => {
          const score = scores[category.key] as number
          const color = getScoreColor(score)
          const Icon = category.icon

          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className="text-sm text-slate-400 font-medium">
                  {category.weight}
                </span>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1">
                {category.label}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {category.description}
              </p>

              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold" style={{ color }}>
                  <CountUp
                    end={score}
                    duration={1}
                    delay={0.5 + index * 0.1}
                  />
                </div>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
