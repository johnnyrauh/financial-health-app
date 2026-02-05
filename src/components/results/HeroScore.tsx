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

  // Responsive circle radius - smaller on mobile
  const mobileRadius = 90
  const desktopRadius = 120

  // We'll use CSS to control which SVG is shown
  const mobileCircumference = 2 * Math.PI * mobileRadius
  const desktopCircumference = 2 * Math.PI * desktopRadius

  const mobileProgress = (score / 100) * mobileCircumference
  const desktopProgress = (score / 100) * desktopCircumference

  return (
    <div className="text-center py-4 sm:py-8">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-slate-600 text-base sm:text-lg mb-2"
      >
        Great news, <span className="font-semibold text-indigo-600">{name}</span>!
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8"
      >
        Your Financial Health Score
      </motion.h1>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="relative inline-flex items-center justify-center mb-4 sm:mb-6"
      >
        {/* Mobile SVG (shown on small screens) */}
        <svg width="220" height="220" className="transform -rotate-90 sm:hidden">
          <circle
            cx="110"
            cy="110"
            r={mobileRadius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
          />
          <motion.circle
            cx="110"
            cy="110"
            r={mobileRadius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={mobileCircumference}
            initial={{ strokeDashoffset: mobileCircumference }}
            animate={{ strokeDashoffset: mobileCircumference - mobileProgress }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Desktop SVG (shown on larger screens) */}
        <svg width="280" height="280" className="transform -rotate-90 hidden sm:block">
          <circle
            cx="140"
            cy="140"
            r={desktopRadius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
          />
          <motion.circle
            cx="140"
            cy="140"
            r={desktopRadius}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={desktopCircumference}
            initial={{ strokeDashoffset: desktopCircumference }}
            animate={{ strokeDashoffset: desktopCircumference - desktopProgress }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold"
            style={{ color }}
          >
            <CountUp end={score} duration={1.5} delay={0.5} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-slate-500 text-xs sm:text-sm"
          >
            out of 100
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-semibold text-sm sm:text-base" style={{ color }}>
          {label}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-4 sm:mt-6 text-slate-600 max-w-md mx-auto text-sm sm:text-base px-2"
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
