import { motion } from "framer-motion"
import { ArrowRight, Shield, TrendingUp, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"

export function Welcome() {
  const { goNext } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative safe-area-inset">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl w-full text-center px-2"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-xl"
        >
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight"
        >
          Financial Health
          <br />
          <span className="text-white/90">Score</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-12 max-w-lg mx-auto px-2"
        >
          Get your personalized financial score and actionable recommendations
          in just 3 minutes
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          <FeaturePill icon={<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} text="Private & Secure" />
          <FeaturePill icon={<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} text="Evidence-Based" />
          <FeaturePill icon={<Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} text="Personalized" />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={goNext}
            size="lg"
            className="bg-white text-indigo-600 hover:bg-white/90 shadow-2xl shadow-black/20 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto max-w-xs"
          >
            Get Your Score
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 sm:mt-8 text-white/60 text-xs sm:text-sm"
        >
          Join 50,000+ people who've improved their financial health
        </motion.p>
      </motion.div>
    </div>
  )
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium">
      {icon}
      {text}
    </div>
  )
}
