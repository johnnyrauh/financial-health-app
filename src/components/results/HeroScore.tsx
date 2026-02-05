import { motion } from "framer-motion"
import CountUp from "react-countup"
import { getScoreColor, getScoreLabel } from "@/lib/utils"

interface HeroScoreProps {
  score: number
  name: string
}

export function HeroScore({ score, name }: HeroScoreProps) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  // Calculate stroke dasharray for the progress circle
  const circumference = 2 * Math.PI * 120 // radius = 120
  const progress = (score / 100) * circumference

  return (
    <div className="text-center py-8">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-slate-600 text-lg mb-2"
      >
        Great news, <span className="font-semibold text-indigo-600">{name}</span>!
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8"
      >
        Your Financial Health Score
      </motion.h1>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="relative inline-flex items-center justify-center mb-6"
      >
        {/* Background circle */}
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-6xl sm:text-7xl font-bold"
            style={{ color }}
          >
            <CountUp end={score} duration={1.5} delay={0.5} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-slate-500 text-sm"
          >
            out of 100
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-semibold" style={{ color }}>
          {label}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-6 text-slate-600 max-w-md mx-auto"
      >
        {score >= 80
          ? "Excellent work! You're in great financial shape. Let's fine-tune a few things."
          : score >= 60
          ? "You're doing well! There are some opportunities to improve your financial health."
          : score >= 40
          ? "You have a solid foundation. Let's work on strengthening some areas."
          : "Don't worry - we've identified several ways to improve your financial health."}
      </motion.p>
    </div>
  )
}
