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
      <div className="py-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          You're in great shape!
        </h3>
        <p className="text-slate-600">
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
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Your Priority Actions
        </h2>
        <p className="text-slate-600 mb-4">
          Focus on these {recommendations.length} recommendations to improve your score
        </p>
        {totalImpact > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full"
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

      <div className="space-y-4">
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
