import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ExternalLink, DollarSign, AlertCircle, TrendingUp } from "lucide-react"
import type { Recommendation } from "@/types"

interface PriorityCardProps {
  recommendation: Recommendation
  index: number
}

export function PriorityCard({ recommendation, index }: PriorityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const priorityColors = {
    high: {
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
      icon: "text-red-500",
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      icon: "text-amber-500",
    },
    low: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      icon: "text-blue-500",
    },
  }

  const colors = priorityColors[recommendation.priority]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border-2 overflow-hidden transition-all ${colors.border} ${
        isExpanded ? colors.bg : "bg-white"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}
          >
            <span className={`text-lg font-bold ${colors.icon}`}>
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.badge}`}
              >
                {recommendation.priority.toUpperCase()} PRIORITY
              </span>
              <span className="text-xs text-slate-400">
                {recommendation.category}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg mb-2">
              {recommendation.title}
            </h3>

            {recommendation.dollarImpact > 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {recommendation.impactDescription}
                </span>
              </div>
            )}
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-slate-200">
              {/* Current vs Recommended */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">
                      Current State
                    </span>
                  </div>
                  <p className="text-sm text-red-600">
                    {recommendation.currentState}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-green-600">
                    {recommendation.recommendedState}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">
                  {recommendation.explanation}
                </p>
              </div>

              {/* Action Steps */}
              <h4 className="font-semibold text-slate-900 mb-4">
                Action Steps
              </h4>
              <div className="space-y-4">
                {recommendation.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                      {stepIndex + 1}
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900 mb-1">
                        {step.title}
                      </h5>
                      <p className="text-sm text-slate-600 mb-2">
                        {step.description}
                      </p>
                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Learn more
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
