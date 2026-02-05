import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"
import type { Recommendation } from "@/types"
import { PriorityCard } from "./PriorityCard"

interface PriorityActionsProps {
  recommendations: Recommendation[]
}

export function PriorityActions({ recommendations }: PriorityActionsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="py-4 sm:py-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
          You're in great shape!
        </h3>
        <p className="text-slate-600 text-sm sm:text-base">
          We couldn't find any major areas for improvement. Keep up the great work!
        </p>
      </div>
    )
  }

  // Calculate total potential impact
  const totalImpact = recommendations.reduce(
    (sum, rec) => sum + rec.dollarImpact,
    0
  )

  return (
    <div className="py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-4 sm:mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Your Priority Actions
        </h2>
        <p className="text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">
          Focus on these {recommendations.length} recommendations to improve your score
        </p>
        {totalImpact > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base"
          >
            <span className="font-semibold">Total potential impact:</span>
            <span className="font-bold">
              ${totalImpact >= 1000000
                ? `${(totalImpact / 1000000).toFixed(1)}M`
                : totalImpact >= 1000
                ? `${(totalImpact / 1000).toFixed(0)}K`
                : totalImpact.toFixed(0)}+
            </span>
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-3 sm:space-y-4">
        {recommendations.map((recommendation, index) => (
          <PriorityCard
            key={recommendation.id}
            recommendation={recommendation}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
