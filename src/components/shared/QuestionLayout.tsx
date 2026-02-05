import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { ProgressBar } from "./ProgressBar"

interface QuestionLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  currentStep: number
  totalSteps: number
  showProgress?: boolean
}

export function QuestionLayout({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  showProgress = true,
}: QuestionLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      {showProgress && (
        <div className="p-4 sm:p-6">
          <ProgressBar current={currentStep} total={totalSteps} />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-base sm:text-lg"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
